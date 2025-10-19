'use client'

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTeacher } from "@/context/teacherContext";
import { initSocket, sendMessage, disconnectSocket } from "@/lib/socket";
import { teacherChatApi } from "@/services/APImethods/teacherAPImethods";

// ---------- ChatHeader ----------
const ChatHeader = ({ studentName, studentAvatar, isOnline }: { studentName: string; studentAvatar?: string; isOnline: boolean }) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={studentAvatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"}
            alt="Student avatar"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${isOnline ? "bg-green-500" : "bg-gray-400"} rounded-full border-2 border-white`}></div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{studentName}</h2>
          <p className="text-sm text-slate-500">{isOnline ? "Active now" : "Offline"}</p>
        </div>
      </div>
    </div>
  );
};

// ---------- ChatMessages ----------
const ChatMessages = ({ messages, teacherId, studentAvatar }: { messages: any[]; teacherId: string; studentAvatar?: string }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50">
      <div className="space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.senderId === teacherId ? "flex-row-reverse" : "flex-row"
              }`}
          >
            {msg.senderId !== teacherId && (
              <img
                src={studentAvatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"}
                alt="Student Avatar"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100"
              />
            )}

            <div
              className={`flex flex-col ${msg.senderId === teacherId ? "items-end" : "items-start"
                } max-w-md`}
            >
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm ${msg.senderId === teacherId
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-white text-slate-800 rounded-tl-sm"
                  }`}
              >
                <p className="text-sm leading-relaxed">{msg.message}</p>
              </div>
              <span className="text-xs text-slate-500 mt-1.5 px-1">
                {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

// ---------- ChatInput ----------
const ChatInput = ({ input, setInput, handleSend }: { input: string; setInput: (val: string) => void; handleSend: () => void }) => {
  return (
    <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center gap-3">
      <input
        type="text"
        placeholder="Type a message..."
        className="w-full px-4 py-3 bg-slate-100 rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-200 flex-shrink-0"
        onClick={handleSend}
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  );
};

// ---------- Main TeacherChat Page ----------
export default function TeacherChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [studentInfo, setStudentInfo] = useState<{ name: string; profilePicture?: string } | null>(null);
  const { teacher } = useTeacher();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isOnline, setIsOnline] = useState(false);

  const teacherId = teacher?._id;
  const studentId = params?.studentId as string;
  const chatId = searchParams.get("chatId");

  useEffect(() => {
    if (!chatId) return;

    const fetchStudent = async () => {
      try {
        const res = await teacherChatApi.getChatInfo(chatId);
        setStudentInfo(res.data.studentId);
      } catch (err) {
        console.error("Failed to fetch student info", err);
      }
    };

    fetchStudent();
  }, [chatId]);

  // Fetch previous messages
  useEffect(() => {
    if (!teacherId || !studentId || !chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await teacherChatApi.getmessages(chatId);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load previous messages", err);
      }
    };

    fetchMessages();
  }, [teacherId, studentId, chatId]);

  // Initialize socket
  useEffect(() => {
    if (!teacherId) return;

    const socket = initSocket(teacherId, (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("onlineUsers", (users: string[]) => {
      setIsOnline(users.includes(studentId));
    });

    return () => {
      disconnectSocket();
    };
  }, [teacherId, studentId]);

  const handleSend = () => {
    if (!input || !teacherId || !studentId) return;

    const msg = { senderId: teacherId, receiverId: studentId, message: input, chatId };
    sendMessage(msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader studentName={studentInfo?.name || "Student"} studentAvatar={studentInfo?.profilePicture} isOnline={isOnline} />
      <ChatMessages messages={messages} teacherId={teacherId!} studentAvatar={studentInfo?.profilePicture} />
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
    </div>
  );
}