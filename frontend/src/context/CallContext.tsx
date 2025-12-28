"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { getSocket, initiateCall, answerCall as socketAnswerCall, rejectCall as socketRejectCall, endCall as socketEndCall, attachSocketListener } from "@/lib/socket";
import { sharedWebRTCApi } from "@/services/APIservices/sharedApiService";
import { showInfoToast, showErrorToast } from "@/utils/Toast";

type CallState = "idle" | "incoming" | "calling" | "connected";

interface CallContextType {
    callState: CallState;
    callerInfo: { name: string; from: string } | null;
    remoteStream: MediaStream | null;
    localStream: MediaStream | null;
    startCall: (userId: string, userName: string) => void;
    acceptCall: () => void;
    rejectCall: () => void;
    endCall: () => void;
    isVideoEnabled: boolean;
    isAudioEnabled: boolean;
    toggleVideo: () => void;
    toggleAudio: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
    const [callState, setCallState] = useState<CallState>("idle");
    const [callerInfo, setCallerInfo] = useState<{ name: string; from: string } | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    // Media Controls
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null); // We might need this if we render here, but mostly we expose the stream

    // Keep track of who we are talking to
    const callPeerIdRef = useRef<string | null>(null);

    // ---------------- MEDIA HELPERS ----------------
    const getMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            setIsVideoEnabled(true);
            setIsAudioEnabled(true);
            return stream;
        } catch (err) {
            console.error("Failed to get media", err);
            showErrorToast("Failed to access camera/microphone");
            return null;
        }
    };

    const cleanupMedia = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        setRemoteStream(null);
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
    };

    // ---------------- WEBRTC HELPERS ----------------
    const createPeerConnection = async () => {
        let iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
        try {
            const res: any = await sharedWebRTCApi.getIceConfig();
            if (res?.data) iceServers = res.data;
        } catch (e) {
            console.error("Using default STUN", e);
        }

        const pc = new RTCPeerConnection({ iceServers });

        pc.onicecandidate = (event) => {
            if (event.candidate && callPeerIdRef.current) {
                const socket = getSocket();
                if (socket) socket.emit("ice-candidate", event.candidate, callPeerIdRef.current);
            }
        };

        pc.ontrack = (event) => {
            console.log("Remote track received");
            setRemoteStream(event.streams[0]);
        };

        peerConnectionRef.current = pc;
        return pc;
    };

    // ---------------- LISTENERS ----------------
    useEffect(() => {
        // Incoming Call
        const cleanupIncoming = attachSocketListener("incoming-call", async (data: { signal: any; from: string; name: string }) => {
            console.log("Incoming call from", data.name);
            if (callState !== "idle") {
                // Busy
                // Optionally emit "busy" signal
                return;
            }
            setCallerInfo({ name: data.name, from: data.from });
            callPeerIdRef.current = data.from;
            setCallState("incoming");

            // We technically don't need to create PC yet, only when accepted.
            // But we need to save the offer (signal) to set it later.
            // Let's store it in a ref or state to use when accepted.
            (window as any).pendingOffer = data.signal;
        });

        // Call Accepted (By the other person when WE are the caller)
        const cleanupAccepted = attachSocketListener("call-accepted", async (signal: any) => {
            console.log("Call accepted!");
            setCallState("connected");
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
            }
        });

        // Call Rejected
        const cleanupRejected = attachSocketListener("call-rejected", () => {
            showInfoToast("Call rejected");
            endCall();
        });

        // Call Ended
        const cleanupEnded = attachSocketListener("call-ended", () => {
            showInfoToast("Call ended");
            // Full cleanup
            setCallState("idle");
            setCallerInfo(null);
            callPeerIdRef.current = null;
            cleanupMedia();
        });

        // ICE Candidate
        const cleanupIce = attachSocketListener("ice-candidate", async (candidate: any, from: string) => {
            if (peerConnectionRef.current) {
                try {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error("Error adding ice candidate", e);
                }
            }
        });

        return () => {
            cleanupIncoming();
            cleanupAccepted();
            cleanupRejected();
            cleanupEnded();
            cleanupIce();
        };
    }, [callState]); // Re-bind if state changes? Actually state is in closure if not careful.
    // Using listeners that depend on state is tricky. 
    // Ideally, the listeners should be stable. The state check inside "incoming-call" works because it accesses current state? 
    // No, closure staleness. 
    // BUT `attachSocketListener` returns a cleanup function, so if dependencies change, we re-subscribe with new closure.
    // So including `callState` in dependency array is correct for `incoming-call` to see the right state.


    // ---------------- ACTIONS ----------------

    const startCall = async (userId: string, userName: string) => {
        setCallState("calling");
        callPeerIdRef.current = userId;
        setCallerInfo({ name: userName, from: userId }); // displaying who we are calling

        const stream = await getMediaStream();
        if (!stream) {
            setCallState("idle");
            return;
        }

        const pc = await createPeerConnection();
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        initiateCall({
            userToCall: userId,
            signalData: offer,
            from: getSocket()?.id || "", // sender socket id
            name: "User" // We should ideally pass real name from Profile Context, but for now generic or rely on backend to fill?
            // Backend doesn't know name unless we send it. 
            // Ideally we fetch current user name from Student/Teacher Context. 
            // For now let's assume the caller UI passes it or we send "Incoming Call"
        });
    };

    const acceptCall = async () => {
        const stream = await getMediaStream();
        if (!stream) {
            endCall();
            return;
        }

        const pc = await createPeerConnection();
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        const pendingOffer = (window as any).pendingOffer;
        if (pendingOffer) {
            await pc.setRemoteDescription(new RTCSessionDescription(pendingOffer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socketAnswerCall({
                signal: answer,
                to: callPeerIdRef.current || ""
            });

            setCallState("connected");
        }
    };

    const rejectCall = () => {
        if (callPeerIdRef.current) {
            socketRejectCall({ to: callPeerIdRef.current });
        }
        setCallState("idle");
        setCallerInfo(null);
        callPeerIdRef.current = null;
        (window as any).pendingOffer = null;
    };

    const endCall = () => {
        if (callPeerIdRef.current) {
            socketEndCall({ to: callPeerIdRef.current });
        }
        cleanupMedia();
        setCallState("idle");
        setCallerInfo(null);
        callPeerIdRef.current = null;
        (window as any).pendingOffer = null;
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    };

    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    };

    return (
        <CallContext.Provider value={{
            callState,
            callerInfo,
            remoteStream,
            localStream,
            startCall,
            acceptCall,
            rejectCall,
            endCall,
            isVideoEnabled,
            isAudioEnabled,
            toggleVideo,
            toggleAudio
        }}>
            {children}
        </CallContext.Provider>
    );
};

export const useCall = () => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error("useCall must be used within a CallProvider");
    }
    return context;
};
