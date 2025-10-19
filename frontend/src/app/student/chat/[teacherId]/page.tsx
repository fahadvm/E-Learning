'use client'

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useStudent } from "@/context/studentContext";
import { initSocket, sendMessage, disconnectSocket } from "@/lib/socket";
import { studentChatApi } from "@/services/APImethods/studentAPImethods";

// ---------- ChatHeader Component ----------
const ChatHeader = ({ teacherName, teacherAvatar, isOnline }: { teacherName: string; teacherAvatar?: string; isOnline: boolean }) => {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={teacherAvatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"}
            alt="Teacher avatar"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${isOnline ? "bg-green-500" : "bg-gray-400"} rounded-full border-2 border-white`}></div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{teacherName}</h2>
          <p className="text-sm text-slate-500">{isOnline ? "Active now" : "Offline"}</p>
        </div>
      </div>
    </div>
  );
};

// ---------- ChatMessages Component ----------
const ChatMessages = ({ messages, studentId, teacherAvatar }: { messages: any[]; studentId: string, teacherAvatar?: string }) => {
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
            className={`flex items-start gap-3 ${msg.senderId === studentId ? "flex-row-reverse" : "flex-row"
              }`}
          >
            {msg.senderId !== studentId && (
              <img
                src={teacherAvatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"}
                alt="Teacher Avatar"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100"
              />
            )}

            <div
              className={`flex flex-col ${msg.senderId === studentId ? "items-end" : "items-start"
                } max-w-md`}
            >
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm ${msg.senderId === studentId
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

// ---------- ChatInput Component ----------
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

// ---------- Main StudentChat Page ----------
export default function StudentChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [teachertInfo, setTeacherInfo] = useState<{ name: string; profilePicture?: string } | null>(null);
  const { student } = useStudent();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isOnline, setIsOnline] = useState(false);

  const teacherId = params?.teacherId as string;
  const studentId = student?._id;
  const chatId = searchParams.get("chatId");

  useEffect(() => {
    if (!chatId) return;

    const fetchTeacher = async () => {
      try {
        const res = await studentChatApi.getChatInfo(chatId);
        setTeacherInfo(res.data.teacherId);
      } catch (err) {
        console.error("Failed to fetch student info", err);
      }
    };
    fetchTeacher();
  }, [chatId]);

  // Fetch previous messages
  useEffect(() => {
    if (!studentId || !teacherId || !chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await studentChatApi.getmessages(chatId);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load previous messages", err);
      }
    };

    fetchMessages();
  }, [studentId, teacherId, chatId]);

  // Initialize socket
  useEffect(() => {
    if (!studentId) return;

    const socket = initSocket(studentId, (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("onlineUsers", (users: string[]) => {
      setIsOnline(users.includes(teacherId));
    });

    return () => {
      disconnectSocket();
    };
  }, [studentId, teacherId]);

  const handleSend = () => {
    if (!input || !studentId || !teacherId) return;

    const msg = { senderId: studentId, receiverId: teacherId, message: input, chatId };
    sendMessage(msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader teacherName={teachertInfo?.name || "Teacher"} teacherAvatar={teachertInfo?.profilePicture} isOnline={isOnline} />
      <ChatMessages messages={messages} studentId={studentId!} teacherAvatar={teachertInfo?.profilePicture} />
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
    </div>
  );
}