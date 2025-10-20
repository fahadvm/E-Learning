'use client'

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTeacher } from "@/context/teacherContext";
import { initSocket, sendMessage, sendTyping, sendReadMessage, sendMessageReaction, sendDeleteMessage, sendEditMessage, disconnectSocket } from "@/lib/socket";
import { teacherChatApi } from "@/services/APImethods/teacherAPImethods";

// ---------- ConfirmationDialog Component ----------
const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 text-slate-800 rounded-lg hover:bg-gray-400 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

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
const ChatMessages = ({
  messages,
  teacherId,
  studentAvatar,
  isTyping,
  markMessagesAsRead,
  handleReaction,
  handleDelete,
  handleEdit,
  editingMessageId,
  editInput,
  setEditInput,
  handleEditSubmit,
  showDeleteDialog,
  setShowDeleteDialog,
  showEditDialog,
  setShowEditDialog,
  confirmDeleteMessageId,
  confirmEditMessageId,
  setConfirmDeleteMessageId,
  setEditingMessageId,
}: {
  messages: any[];
  teacherId: string;
  studentAvatar?: string;
  isTyping: boolean;
  markMessagesAsRead: (messages: any[]) => void;
  handleReaction: (messageId: string, reaction: string) => void;
  handleDelete: (messageId: string) => void;
  handleEdit: (messageId: string, message: string) => void;
  editingMessageId: string | null;
  editInput: string;
  setEditInput: (value: string) => void;
  handleEditSubmit: (messageId: string) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (value: boolean) => void;
  showEditDialog: boolean;
  setShowEditDialog: (value: boolean) => void;
  confirmDeleteMessageId: string | null;
  confirmEditMessageId: string | null;
  setConfirmDeleteMessageId: (value: string) => void;
  setEditingMessageId: (value: string | null) => void;
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
            className={`flex items-start gap-3 ${msg.senderId === teacherId ? "flex-row-reverse" : "flex-row"}`}
          >
            {msg.senderId !== teacherId && (
              <img
                src={studentAvatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"}
                alt="Student Avatar"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100"
              />
            )}

            <div
              className={`flex flex-col ${msg.senderId === teacherId ? "items-end" : "items-start"} max-w-md relative`}
            >
              {editingMessageId === msg._id && msg.senderId === teacherId ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setShowEditDialog(true)}
                  >
                    Save
                  </button>
                  <button
                    className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    onClick={() => {
                      setEditInput("");
                      setEditingMessageId(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${msg.senderId === teacherId ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white text-slate-800 rounded-tl-sm"
                      }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    {msg.edited && (
                      <span className="text-xs text-slate-400 italic">(edited)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5 px-1">
                    <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    {msg.senderId === teacherId && (
                      <span className="flex items-center">
                        {msg.read ? (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                            <path d="M8 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l8-8a1 1 0 00-1.414-1.414L8 12.586z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                  {msg.reactions?.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      {msg.reactions.map((reaction: { userId: string; reaction: string }, idx: number) => (
                        <span key={idx} className="text-sm">{reaction.reaction}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mt-1">
                    <button
                      className="text-sm text-slate-500 hover:text-blue-500"
                      onClick={() => setShowReactionPicker(showReactionPicker === msg._id ? null : msg._id)}
                    >
                      😊
                    </button>
                    {msg.senderId === teacherId && (
                      <>
                        <button
                          className="text-sm text-slate-500 hover:text-blue-500"
                          onClick={() => handleEdit(msg._id, msg.message)}
                        >
                          ✏️
                        </button>
                        <button
                          className="text-sm text-slate-500 hover:text-red-500"
                          onClick={() => {
                            setConfirmDeleteMessageId(msg._id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                  {showReactionPicker === msg._id && (
                    <div className="absolute z-10 bg-white border border-slate-200 rounded-lg p-2 flex gap-2 mt-2">
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
                </>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
            <img
              src={studentAvatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"}
              alt="Student Avatar"
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
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={() => {
          if (confirmDeleteMessageId) handleDelete(confirmDeleteMessageId);
          setShowDeleteDialog(false);
        }}
        onCancel={() => setShowDeleteDialog(false)}
      />
      <ConfirmationDialog
        isOpen={showEditDialog}
        title="Edit Message"
        message="Are you sure you want to save changes to this message?"
        onConfirm={() => {
          if (confirmEditMessageId) handleEditSubmit(confirmEditMessageId);
          setShowEditDialog(false);
        }}
        onCancel={() => setShowEditDialog(false)}
      />
    </div>
  );
};

// ---------- ChatInput ----------
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

// --- Main TeacherChat Page ---
export default function TeacherChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [studentInfo, setStudentInfo] = useState<{ name: string; profilePicture?: string } | null>(null);
  const { teacher } = useTeacher();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isOnline, setIsOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [confirmDeleteMessageId, setConfirmDeleteMessageId] = useState<string | null>(null);
  const [confirmEditMessageId, setConfirmEditMessageId] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    const socket = initSocket(
      teacherId,
      (data) => {
        setMessages((prev) => [...prev, data]);
        setIsTyping(false); // Stop typing indicator when a message is received
      },
      (data) => {
        if (data.senderId === studentId) {
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
      },
      (data) => {
        setMessages((prev) => prev.filter((msg) => !(msg._id === data.messageId && msg.chatId === data.chatId)));
      },
      (data) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId && msg.chatId === data.chatId
              ? { ...msg, message: data.newMessage, edited: true }
              : msg
          )
        );
      }
    );

    socket.on("onlineUsers", (users: string[]) => {
      setIsOnline(users.includes(studentId));
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      disconnectSocket();
    };
  }, [teacherId, studentId]);

  const handleSend = () => {
    if (!input || !teacherId || !studentId || !chatId) return;

    const msg = { senderId: teacherId, receiverId: studentId, message: input, chatId };
    sendMessage(msg);
    setMessages((prev) => [...prev, { ...msg, read: false, createdAt: new Date(), reactions: [] }]);
    setInput("");
  };

  const handleTyping = () => {
    if (!teacherId || !studentId) return;
    sendTyping({ senderId: teacherId, receiverId: studentId });
  };

  const handleReaction = (messageId: string, reaction: string) => {
    if (!teacherId || !studentId || !chatId) return;
    sendMessageReaction({
      chatId,
      messageId,
      userId: teacherId,
      reaction,
      receiverId: studentId,
    });
  };

  const handleDelete = (messageId: string) => {
    if (!teacherId || !studentId || !chatId) return;
    sendDeleteMessage({
      chatId,
      messageId,
      senderId: teacherId,
      receiverId: studentId,
    });
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  };

  const handleEdit = (messageId: string, message: string) => {
    setEditingMessageId(messageId);
    setEditInput(message);
    setConfirmEditMessageId(messageId);
  };

  const handleEditSubmit = (messageId: string) => {
    if (!editInput || !teacherId || !studentId || !chatId) return;
    sendEditMessage({
      chatId,
      messageId,
      senderId: teacherId,
      newMessage: editInput,
      receiverId: studentId,
    });
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, message: editInput, edited: true } : msg
      )
    );
    setEditingMessageId(null);
    setEditInput("");
    setConfirmEditMessageId(null);
  };

  const markMessagesAsRead = (messages: any[]) => {
    if (!teacherId || !studentId || !chatId) return;

    messages.forEach((msg) => {
      if (msg.senderId === studentId && !msg.read) {
        sendReadMessage({
          chatId,
          messageId: msg._id,
          senderId: studentId,
          receiverId: teacherId,
        });
      }
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader studentName={studentInfo?.name || "Student"} studentAvatar={studentInfo?.profilePicture} isOnline={isOnline} />
      <ChatMessages
        messages={messages}
        teacherId={teacherId!}
        studentAvatar={studentInfo?.profilePicture}
        isTyping={isTyping}
        markMessagesAsRead={markMessagesAsRead}
        handleReaction={handleReaction}
        handleDelete={() => {
          if (confirmDeleteMessageId) handleDelete(confirmDeleteMessageId);
          setShowDeleteDialog(false);
        }}
        handleEdit={handleEdit}
        editingMessageId={editingMessageId}
        editInput={editInput}
        setEditInput={setEditInput}
        handleEditSubmit={() => {
          if (confirmEditMessageId) handleEditSubmit(confirmEditMessageId);
          setShowEditDialog(false);
        }}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={(value) => {
          setShowDeleteDialog(value);
          if (!value) setConfirmDeleteMessageId(null);
        }}
        showEditDialog={showEditDialog}
        setShowEditDialog={(value) => {
          setShowEditDialog(value);
          if (!value) setConfirmEditMessageId(null);
        }}
        confirmDeleteMessageId={confirmDeleteMessageId}
        confirmEditMessageId={confirmEditMessageId}
         
        setConfirmDeleteMessageId={(value) => {
          setConfirmDeleteMessageId(value);
          if (!value) setConfirmDeleteMessageId(null);
        }}
        setEditingMessageId={(value) => {
          setEditingMessageId(value);
          if (!value) setEditingMessageId(null);
        }}
       
      />
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} handleTyping={handleTyping} />
    </div>
  );
}