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
    const localStreamRef = useRef<MediaStream | null>(null);

    // Media Controls
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    const callPeerIdRef = useRef<string | null>(null);
    const callStateRef = useRef<CallState>("idle");
    const pendingOfferRef = useRef<any>(null);

    // Audio Refs
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);
    const callingToneRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio on client side
        ringtoneRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");
        ringtoneRef.current.loop = true;

        callingToneRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3"); // A softer calling tone
        callingToneRef.current.loop = true;

        return () => {
            stopAllSounds();
        };
    }, []);

    const stopAllSounds = () => {
        if (ringtoneRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
        }
        if (callingToneRef.current) {
            callingToneRef.current.pause();
            callingToneRef.current.currentTime = 0;
        }
    };

    // Sync Refs
    useEffect(() => {
        callStateRef.current = callState;
    }, [callState]);

    useEffect(() => {
        localStreamRef.current = localStream;
    }, [localStream]);


    // ---------------- MEDIA HELPERS ----------------
    const getMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localStreamRef.current = stream; // Immediate sync to avoid race conditions
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
        // Use Ref for cleanup to avoid stale closure issues in listeners
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            setLocalStream(null);
            localStreamRef.current = null; // Immediate sync
        }
        setRemoteStream(null);
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        stopAllSounds();
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
            if (callStateRef.current !== "idle") {
                // Busy
                return;
            }
            setCallerInfo({ name: data.name, from: data.from });
            callPeerIdRef.current = data.from;
            setCallState("incoming");
            pendingOfferRef.current = data.signal;
            ringtoneRef.current?.play().catch(e => console.log("Audio play blocked", e));
        });

        // Call Accepted (By the other person when WE are the caller)
        const cleanupAccepted = attachSocketListener("call-accepted", async (signal: any) => {
            console.log("Call accepted!");
            setCallState("connected");
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
            }
            stopAllSounds();
        });

        // Call Rejected
        const cleanupRejected = attachSocketListener("call-rejected", () => {
            showInfoToast("Call rejected");
            cleanupMedia();
            setCallState("idle");
            setCallerInfo(null);
            callPeerIdRef.current = null;
            pendingOfferRef.current = null;
        });

        // Call Ended
        const cleanupEnded = attachSocketListener("call-ended", () => {
            showInfoToast("Call ended");
            cleanupMedia();
            setCallState("idle");
            setCallerInfo(null);
            callPeerIdRef.current = null;
        });

        // ICE Candidate
        const cleanupIce = attachSocketListener("ice-candidate", async (data: { candidate: any; from: string }) => {
            if (peerConnectionRef.current && data.candidate) {
                try {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
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
    }, []); // Empty dependency array ensures listeners are attached ONCE and stable


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

        const socket = getSocket();

        initiateCall({
            userToCall: userId,
            signalData: offer,
            from: socket?.id || "",
            name: "User"
        });

        callingToneRef.current?.play().catch(e => console.log("Audio play blocked", e));
    };

    const acceptCall = async () => {
        const stream = await getMediaStream();
        if (!stream) {
            endCall();
            return;
        }

        const pc = await createPeerConnection();
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        const pendingOffer = pendingOfferRef.current;
        if (pendingOffer) {
            await pc.setRemoteDescription(new RTCSessionDescription(pendingOffer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socketAnswerCall({
                signal: answer,
                to: callPeerIdRef.current || ""
            });

            setCallState("connected");
            stopAllSounds();
        }
    };

    const rejectCall = () => {
        if (callPeerIdRef.current) {
            socketRejectCall({ to: callPeerIdRef.current });
        }
        cleanupMedia(); // Ensure media tracks are stopped
        setCallState("idle");
        setCallerInfo(null);
        callPeerIdRef.current = null;
        pendingOfferRef.current = null;
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
