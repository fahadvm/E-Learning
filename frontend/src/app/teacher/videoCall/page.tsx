"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Video, Mic, MicOff, PhoneOff , VideoOff } from "lucide-react";



const socket: Socket = io("http://localhost:8000");

interface UserConnectedData {
  userId: string;
}

export default function TeacherPage() {
  const [roomId, setRoomId] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  /* -------------------------------------------------------------
     ALL WebRTC / socket logic stays EXACTLY the same as before
  ------------------------------------------------------------- */
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

  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      setIsVideoOff(!isVideoOff);
    }
  };

  const leaveCall = () => {
    if (localVideoRef.current) {
      const stream = localVideoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    setIsConnected(false);
    socket.disconnect();
  };

  /* -------------------------------------------------------------
     UI – Google Meet style
  ------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* ---------- Header (Meet style) ---------- */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-gray-800 text-white">
        <h1 className="text-xl font-medium">DevNext Video Call</h1>
        <div className="text-sm">
          {isConnected ? "Connected" : "Waiting for participant..."}
        </div>
      </header>

      {/* ---------- Main video area ---------- */}
      <main className="flex-1 w-full max-w-7xl flex flex-col items-center justify-center gap-4 mt-16">
        {/* Join room UI (only when not connected) */}
        {!isConnected && (
          <div className="bg-gray-800 rounded-xl p-6 flex items-center gap-3 shadow-lg">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={joinRoom}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
            >
              Join Room
            </button>
          </div>
        )}

        {/* Video tiles – 1:1 grid on small screens, side-by-side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Local video */}
          <div className="relative bg-black rounded-xl overflow-hidden shadow-xl">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-80 md:h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-gray-900/70 text-white px-3 py-1 rounded-full text-sm">
              You
            </div>
          </div>

          {/* Remote video */}
          <div className="relative bg-black rounded-xl overflow-hidden shadow-xl">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-80 md:h-full object-cover"
              data-user-id=""
            />
            <div className="absolute bottom-3 left-3 bg-gray-900/70 text-white px-3 py-1 rounded-full text-sm">
              {isConnected ? "Teacher" : "Waiting..."}
            </div>
          </div>
        </div>
      </main>

      {/* ---------- Bottom control bar (Meet style) ---------- */}
      {isConnected && (
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-md py-3 flex items-center justify-center gap-6 text-white">
          {/* Mic */}
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-all ${
              isMuted
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </button>

          {/* Camera */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-all ${
              isVideoOff
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            title={isVideoOff ? "Turn on camera" : "Turn off camera"}
          >
            {isVideoOff ? <VideoOff /> : <Video />}
          </button>

          {/* End call – red */}
          <button
            onClick={leaveCall}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all"
            title="Leave call"
          >
            <PhoneOff />
          </button>

          {/* Screen share (placeholder – same as original) */}
          {/* <button
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
            title="Present now"
          >
            <PresentToAll />
          </button> */}
        </footer>
      )}
    </div>
  );
}