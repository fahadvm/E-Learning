'use client'

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useStudent } from "@/context/studentContext";
import { initSocket, sendMessage, sendTyping, sendReadMessage, sendMessageReaction, disconnectSocket } from "@/lib/socket";
import { studentChatApi } from "@/services/APImethods/studentAPImethods";
import { SmilePlus } from "lucide-react"; // or Smile, MoreHorizontal, etc.


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
const ChatMessages = ({
  messages,
  studentId,
  teacherAvatar,
  isTyping,
  markMessagesAsRead,
  handleReaction
}: {
  messages: any[];
  studentId: string;
  teacherAvatar?: string;
  isTyping: boolean;
  markMessagesAsRead: (messages: any[]) => void;
  handleReaction: (messageId: string, reaction: string) => void;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    markMessagesAsRead(messages);
  }, [messages, markMessagesAsRead]);

  const reactions = ["👍", "❤️", "😂", "😊"];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50">
      <div className="space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={msg._id || idx}
            className={`flex items-start gap-3 ${msg.senderId === studentId ? "flex-row-reverse" : "flex-row"}`}
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
                } max-w-md relative group`} // added 'group' for hover effect
            >
              {/* Message bubble */}
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm relative ${msg.senderId === studentId
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-white text-slate-800 rounded-tl-sm"
                  }`}
              >
                <p className="text-sm leading-relaxed">{msg.message}</p>

                {/* Reaction button - shown only on hover */}
                <button
                  className={`absolute ${msg.senderId === studentId ? "-left-7" : "-right-7"
                    } top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                 transition-opacity duration-200`}
                  onClick={() =>
                    setShowReactionPicker(
                      showReactionPicker === msg._id ? null : msg._id
                    )
                  }
                >
                  <SmilePlus className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                </button>
              </div>

              {/* Time + read status */}
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5 px-1">
                <span>
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.senderId === studentId && (
                  <span className="flex items-center">
                    {msg.read ? (
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                        <path d="M8 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l8-8a1 1 0 00-1.414-1.414L8 12.586z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                      </svg>
                    )}
                  </span>
                )}
              </div>

              {/* Show existing reactions */}
              {msg.reactions?.length > 0 && (
                <div className="flex gap-2 mt-1">
                  {msg.reactions.map(
                    (reaction: { userId: string; reaction: string }, idx: number) => (
                      <span key={idx} className="text-sm">
                        {reaction.reaction}
                      </span>
                    )
                  )}
                </div>
              )}

              {/* Reaction Picker */}
              {showReactionPicker === msg._id && (
                <div
                  className={`absolute z-10 bg-white border border-slate-200 rounded-lg p-2 flex gap-2 mt-2 shadow-md ${msg.senderId === studentId ? "right-0" : "left-0"
                    }`}
                >
                  {reactions.map((reaction) => (
                    <button
                      key={reaction}
                      className="text-lg hover:bg-slate-100 rounded p-1"
                      onClick={() => {
                        handleReaction(msg._id, reaction);
                        setShowReactionPicker(null);
                      }}
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
            <img
              src={teacherAvatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"}
              alt="Teacher Avatar"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100"
            />
            <div className="flex items-start max-w-md">
              <div className="px-4 py-3 rounded-2xl shadow-sm bg-white text-slate-800 rounded-tl-sm">
                <p className="text-sm text-slate-500 italic">Typing...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

// ---------- ChatInput Component ----------
const ChatInput = ({ input, setInput, handleSend, handleTyping }: { input: string; setInput: (val: string) => void; handleSend: () => void; handleTyping: () => void }) => {
  return (
    <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center gap-3">
      <input
        type="text"
        placeholder="Type a message..."
        className="w-full px-4 py-3 bg-slate-100 rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          handleTyping();
        }}
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

// --- Main StudentChat Page ---
export default function StudentChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [teachertInfo, setTeacherInfo] = useState<{ name: string; profilePicture?: string } | null>(null);
  const { student } = useStudent();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isOnline, setIsOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        console.error("Failed to fetch teacher info", err);
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

    const socket = initSocket(
      studentId,
      (data) => {
        setMessages((prev) => [...prev, data]);
        setIsTyping(false); // Stop typing indicator when a message is received
      },
      (data) => {
        if (data.senderId === teacherId) {
          setIsTyping(true);
          // Clear previous timeout
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          // Set timeout to stop typing indicator after 3 seconds of no typing event
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
        }
      },
      (data) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId && msg.chatId === data.chatId ? { ...msg, read: true } : msg
          )
        );
      },
      (data) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId && msg.chatId === data.chatId
              ? { ...msg, reactions: [...(msg.reactions || []), { userId: data.userId, reaction: data.reaction }] }
              : msg
          )
        );
      }
    );

    socket.on("onlineUsers", (users: string[]) => {
      setIsOnline(users.includes(teacherId));
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      disconnectSocket();
    };
  }, [studentId, teacherId]);

  const handleSend = () => {
    if (!input || !studentId || !teacherId || !chatId) return;

    const msg = { senderId: studentId, receiverId: teacherId, message: input, chatId };
    sendMessage(msg);
    setMessages((prev) => [...prev, { ...msg, read: false, createdAt: new Date(), reactions: [] }]);
    setInput("");
  };

  const handleTyping = () => {
    if (!studentId || !teacherId) return;
    sendTyping({ senderId: studentId, receiverId: teacherId });
  };

  const handleReaction = (messageId: string, reaction: string) => {
    if (!studentId || !teacherId || !chatId) return;
    sendMessageReaction({
      chatId,
      messageId,
      userId: studentId,
      reaction,
      receiverId: teacherId,
    });
  };

  const markMessagesAsRead = (messages: any[]) => {
    if (!studentId || !teacherId || !chatId) return;

    messages.forEach((msg) => {
      if (msg.senderId === teacherId && !msg.read) {
        sendReadMessage({
          chatId,
          messageId: msg._id,
          senderId: teacherId,
          receiverId: studentId,
        });
      }
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader teacherName={teachertInfo?.name || "Teacher"} teacherAvatar={teachertInfo?.profilePicture} isOnline={isOnline} />
      <ChatMessages
        messages={messages}
        studentId={studentId!}
        teacherAvatar={teachertInfo?.profilePicture}
        isTyping={isTyping}
        markMessagesAsRead={markMessagesAsRead}
        handleReaction={handleReaction}
      />
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} handleTyping={handleTyping} />
    </div>
  );
}