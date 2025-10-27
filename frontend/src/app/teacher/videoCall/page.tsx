"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:8000');

interface UserConnectedData {
  userId: string;
}

export default function TeacherPage() {
  const [roomId, setRoomId] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const initWebRTC = async () => {
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach(track => peerConnectionRef.current?.addTrack(track, stream));
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate && remoteVideoRef.current?.dataset.userId) {
          socket.emit('ice-candidate', event.candidate, remoteVideoRef.current.dataset.userId);
        }
      };

      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      socket.on('user-connected', ({ userId }: UserConnectedData) => {
        setIsConnected(true);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.dataset.userId = userId;
        }
        createOffer();
      });

      socket.on('offer', async (offer: RTCSessionDescriptionInit, fromId: string) => {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit('answer', answer, fromId);
        }
      });

      socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
        try {
          if (peerConnectionRef.current) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      });

      socket.on('user-disconnected', () => {
        setIsConnected(false);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      });

      socket.on('room-full', () => {
        alert('Room is full!');
      });

      return () => {
        socket.off('user-connected');
        socket.off('offer');
        socket.off('answer');
        socket.off('ice-candidate');
        socket.off('user-disconnected');
        socket.off('room-full');
      };
    };

    initWebRTC();
  }, []);

  const createOffer = async () => {
    try {
      if (peerConnectionRef.current && remoteVideoRef.current?.dataset.userId) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit('offer', offer, remoteVideoRef.current.dataset.userId);
      }
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };

  const joinRoom = () => {
    if (roomId) {
      socket.emit('join-room', roomId, 'teacher');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Teacher Video Call</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={joinRoom}
          className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Join Room
        </button>
      </div>
      <div className="flex space-x-4">
        <div>
          <h2 className="text-lg font-semibold">Your Video</h2>
          <video ref={localVideoRef} autoPlay muted className="w-80 h-60 bg-black rounded" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Student Video</h2>
          <video ref={remoteVideoRef} autoPlay className="w-80 h-60 bg-black rounded" data-user-id="" />
        </div>
      </div>
      <p className="mt-4">{isConnected ? 'Connected to student' : 'Waiting for student...'}</p>
    </div>
  );
};

