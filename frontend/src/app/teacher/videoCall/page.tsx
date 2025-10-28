"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Video, Mic, MicOff, PhoneOff, Monitor } from "lucide-react";

const socket: Socket = io("http://localhost:8000");

interface UserConnectedData {
  userId: string;
}

export default function TeacherPage() {
  const [roomId, setRoomId] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const initWebRTC = async () => {
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) =>
          peerConnectionRef.current?.addTrack(track, stream)
        );
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate && remoteVideoRef.current?.dataset.userId) {
          socket.emit("ice-candidate", event.candidate, remoteVideoRef.current.dataset.userId);
        }
      };

      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setIsConnected(true);
        }
      };

      socket.on("user-connected", ({ userId }: UserConnectedData) => {
        setIsConnected(true);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.dataset.userId = userId;
        }
        createOffer();
      });

      socket.on("offer", async (offer: RTCSessionDescriptionInit, fromId: string) => {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit("answer", answer, fromId);
        }
      });

      socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on("ice-candidate", async (candidate: RTCIceCandidateInit) => {
        try {
          if (peerConnectionRef.current) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      });

      socket.on("user-disconnected", () => {
        setIsConnected(false);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      });

      socket.on("room-full", () => alert("Room is full!"));

      return () => {
        socket.off("user-connected");
        socket.off("offer");
        socket.off("answer");
        socket.off("ice-candidate");
        socket.off("user-disconnected");
        socket.off("room-full");
      };
    };

    initWebRTC();
  }, []);

  const createOffer = async () => {
    try {
      if (peerConnectionRef.current && remoteVideoRef.current?.dataset.userId) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit("offer", offer, remoteVideoRef.current.dataset.userId);
      }
    } catch (err) {
      console.error("Error creating offer:", err);
    }
  };

  const joinRoom = () => {
    if (roomId) {
      socket.emit("join-room", roomId, "teacher");
    }
  };

  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
          🎥 DevNext Video Call
        </h1>

        {!isConnected && (
          <div className="flex justify-center mb-8">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="p-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none w-64 text-center"
            />
            <button
              onClick={joinRoom}
              className="ml-3 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all"
            >
              Join Room
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-md">
            <video ref={localVideoRef} autoPlay muted className="w-full h-64 object-cover" />
            <p className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
              You
            </p>
          </div>

          <div className="relative bg-black rounded-2xl overflow-hidden shadow-md">
            <video ref={remoteVideoRef} autoPlay className="w-full h-64 object-cover" data-user-id="" />
            <p className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
              {isConnected ? "Tacher" : "Waiting..."}
            </p>
          </div>
        </div>

        {isConnected && (
          <div className="flex justify-center mt-8 space-x-6">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full shadow-lg ${isMuted ? "bg-gray-400" : "bg-green-500"
                } text-white hover:scale-110 transition`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </button>
            <button
              className="p-4 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition"
              title="Leave Call"
            >
              <PhoneOff />
            </button>
            <button
              className="p-4 rounded-full bg-blue-500 text-white shadow-lg hover:scale-110 transition"
              title="Share Screen (future)"
            >
              <Monitor />
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-gray-600">
          {isConnected ? "Connected ✅" : "Waiting for another user to join..."}
        </p>
      </div>
    </div>
  );
}
