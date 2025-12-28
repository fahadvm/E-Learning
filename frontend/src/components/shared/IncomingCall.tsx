"use client";

import { useCall } from "@/context/CallContext";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function IncomingCall() {
    const {
        callState,
        callerInfo,
        acceptCall,
        rejectCall,
        endCall,
        localStream,
        remoteStream,
        isVideoEnabled,
        isAudioEnabled,
        toggleVideo,
        toggleAudio
    } = useCall();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, callState]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream, callState]);

    if (callState === "idle") return null;

    // ---------------- OUTGOING CALLING ----------------
    // If I am calling someone, show local video + "Calling..."
    if (callState === "calling") {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
                <div className="flex flex-col items-center">
                    {/* Local Preview */}
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 mb-6 shadow-xl">
                        <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">Calling {callerInfo?.name}...</h3>

                    <button onClick={endCall} className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-medium transition-colors text-white shadow-lg flex items-center gap-2">
                        <PhoneOff className="w-5 h-5" /> Cancel
                    </button>
                </div>
            </div>
        );
    }

    // ---------------- INCOMING CALL ----------------
    if (callState === "incoming") {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Phone className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Incoming Call
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        {callerInfo?.name} is video calling you...
                    </p>

                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={rejectCall}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-14 h-14 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 flex items-center justify-center transition-colors">
                                <PhoneOff className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-red-600 transition-colors">Decline</span>
                        </button>

                        <button
                            onClick={acceptCall}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-14 h-14 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 flex items-center justify-center transition-colors">
                                <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-green-600 transition-colors">Accept</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ---------------- CONNECTED ----------------
    return (
        <div className={`fixed z-[100] transition-all duration-300 shadow-2xl overflow-hidden bg-gray-900 ${isMinimized
                ? "bottom-4 right-4 w-72 h-48 rounded-xl border border-gray-700 hover:scale-105"
                : "inset-0 flex flex-col"
            }`}>

            {/* Header (only when full screen) */}
            {!isMinimized && (
                <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
                    <div className="text-white">
                        <h3 className="font-bold text-lg">{callerInfo?.name}</h3>
                        <span className="text-sm text-gray-300">Connected</span>
                    </div>
                    <button onClick={() => setIsMinimized(true)} className="p-2 bg-gray-800/50 rounded-full text-white hover:bg-gray-700">
                        <Minimize2 className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Minimized Restore Button */}
            {isMinimized && (
                <button onClick={() => setIsMinimized(false)} className="absolute top-2 right-2 z-20 p-1 bg-black/50 rounded-full text-white">
                    <Maximize2 className="w-4 h-4" />
                </button>
            )}

            {/* Main Video Area */}
            <div className="relative flex-1 bg-black flex items-center justify-center w-full h-full group">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
                {!remoteStream && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse mb-4"></div>
                        <p>Waiting for video...</p>
                    </div>
                )}

                {/* Local Video (PIP) */}
                <div className={`absolute transition-all duration-300 ${isMinimized ? "hidden" : "bottom-24 right-6 w-32 h-48 sm:w-48 sm:h-36 bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg"
                    }`}>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Controls (only when full screen) */}
            {!isMinimized && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-6">
                    <button onClick={toggleAudio} className={`p-4 rounded-full ${isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}>
                        {isAudioEnabled ? <Mic /> : <MicOff />}
                    </button>

                    <button onClick={endCall} className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors">
                        <PhoneOff />
                    </button>

                    <button onClick={toggleVideo} className={`p-4 rounded-full ${isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}>
                        {isVideoEnabled ? <Video /> : <VideoOff />}
                    </button>
                </div>
            )}
        </div>
    );
}
