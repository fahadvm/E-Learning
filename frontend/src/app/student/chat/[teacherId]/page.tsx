'use client'

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams ,useRouter} from "next/navigation";
import { useStudent } from "@/context/studentContext";
import { initSocket, sendMessage, sendTyping, sendReadMessage, sendMessageReaction, sendDeleteMessage, sendEditMessage, disconnectSocket } from "@/lib/socket";
import { studentChatApi } from "@/services/APIservices/studentApiservice";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 active:scale-95 transition-all duration-200 font-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatHeader = ({ teacherName, teacherAvatar, isOnline }: { teacherName: string; teacherAvatar?: string; isOnline: boolean }) => {
  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <img
            src={teacherAvatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"}
            alt="Teacher avatar"
            className="relative w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
          />
          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${isOnline ? "bg-emerald-500" : "bg-slate-400"} rounded-full border-2 border-white shadow-sm ${isOnline ? 'animate-pulse' : ''}`}></div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{teacherName}</h2>
          <p className={`text-sm font-medium ${isOnline ? "text-emerald-600" : "text-slate-500"}`}>
            {isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};

const ChatMessages = ({
  messages,
  studentId,
  teacherAvatar,
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
  setEditingMessageId,
}: {
  messages: any[];
  studentId: string;
  teacherAvatar?: string;
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
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-slate-50 to-slate-100/50">
      <div className="space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={msg._id || idx}
            className={`flex items-start gap-3 ${msg.senderId === studentId ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-4 duration-300`}
          >
            {msg.senderId !== studentId && (
              <img
                src={teacherAvatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"}
                alt="Teacher Avatar"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-md"
              />
            )}

            <div
              className={`flex flex-col ${msg.senderId === studentId ? "items-end" : "items-start"} max-w-md relative group`}
            >
              {editingMessageId === msg._id && msg.senderId === studentId ? (
                <div className="flex items-center gap-2 w-full animate-in fade-in duration-200">
                  <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    autoFocus
                  />
                  <button
                    className="p-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/30"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    className="p-2.5 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 active:scale-95 transition-all duration-200"
                    onClick={() => {
                      setEditInput("");
                      setEditingMessageId(null);
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={`px-5 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                      msg.senderId === studentId
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-md"
                        : "bg-white text-slate-800 rounded-tl-md border border-slate-200"
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed break-words">{msg.message}</p>
                    {msg.edited && (
                      <span className={`text-xs italic mt-1 block ${msg.senderId === studentId ? 'text-blue-200' : 'text-slate-400'}`}>
                        (edited)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1.5 px-1">
                    <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    {msg.senderId === studentId && (
                      <span className="flex items-center">
                        {msg.read ? (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                            <path d="M8 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l8-8a1 1 0 00-1.414-1.414L8 12.586z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>

                  {msg.reactions?.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {msg.reactions.map((reaction: { userId: string; reaction: string }, idx: number) => (
                        <span key={idx} className="text-base bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-sm">
                          {reaction.reaction}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-200 shadow-sm"
                      onClick={() => setShowReactionPicker(showReactionPicker === msg._id ? null : msg._id)}
                      title="React"
                    >
                      <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    {msg.senderId === studentId && (
                      <>
                        <button
                          className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-200 shadow-sm"
                          onClick={() => handleEdit(msg._id, msg.message)}
                          title="Edit"
                        >
                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all duration-200 shadow-sm group/delete"
                          onClick={() => setShowDeleteDialog(true)}
                          title="Delete"
                        >
                          <svg className="w-4 h-4 text-slate-600 group-hover/delete:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {showReactionPicker === msg._id && (
                    <div className="absolute z-10 bg-white border border-slate-200 rounded-xl p-2 flex gap-1 mt-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                      {reactions.map((reaction) => (
                        <button
                          key={reaction}
                          className="text-xl hover:bg-slate-100 rounded-lg p-2 active:scale-95 transition-all duration-200"
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
          <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <img
              src={teacherAvatar || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"}
              alt="Teacher Avatar"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-md"
            />
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-5 py-4 shadow-md">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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

const ChatInput = ({ input, setInput, handleSend, handleTyping }: { input: string; setInput: (val: string) => void; handleSend: () => void; handleTyping: () => void }) => {
  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-4 flex items-center gap-3 shadow-lg">
      <input
        type="text"
        placeholder="Type a message..."
        className="w-full px-5 py-3.5 bg-slate-100 rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          handleTyping();
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full transition-all duration-200 flex-shrink-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSend}
        disabled={!input.trim()}
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  );
};

export default function StudentChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [teachertInfo, setTeacherInfo] = useState<{ name: string; profilePicture?: string } | null>(null);
  const { student } = useStudent();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [confirmDeleteMessageId, setConfirmDeleteMessageId] = useState<string | null>(null);
  const [confirmEditMessageId, setConfirmEditMessageId] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const teacherId = params?.teacherId as string;
  const studentId = student?._id;
  const [chatId, setChatId] = useState<string | null>(searchParams.get("chatId"));


  useEffect(() => {
    if (!studentId || !teacherId || chatId) return;
    const createOrFetchChat = async () => {
      try {
        const res = await studentChatApi.createOrGetChat({ studentId, teacherId });
        const newChatId = res.data._id;
        setChatId(newChatId);
        router.replace(`/student/chat/${teacherId}?chatId=${newChatId}`);
      } catch (err) {
        console.error("Error creating/fetching chat:", err);
      }
    };

    createOrFetchChat();
  }, [studentId, teacherId, chatId]);

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

  useEffect(() => {
    if (!studentId) return;

    const socket = initSocket(
      studentId,
      (data) => {
        setMessages((prev) => [...prev, data]);
        setIsTyping(false);
      },
      (data) => {
        if (data.senderId === teacherId) {
          setIsTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
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

  const handleDelete = (messageId: string) => {
    if (!studentId || !teacherId || !chatId) return;
    sendDeleteMessage({
      chatId,
      messageId,
      senderId: studentId,
      receiverId: teacherId,
    });
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  };

  const handleEdit = (messageId: string, message: string) => {
    setEditingMessageId(messageId);
    setEditInput(message);
    setConfirmEditMessageId(messageId);
  };

  const handleEditSubmit = (messageId: string) => {
    if (!editInput || !studentId || !teacherId || !chatId) return;
    sendEditMessage({
      chatId,
      messageId,
      senderId: studentId,
      newMessage: editInput,
      receiverId: teacherId,
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
    <div className="flex flex-col h-screen bg-slate-50">
      <ChatHeader teacherName={teachertInfo?.name || "Teacher"} teacherAvatar={teachertInfo?.profilePicture} isOnline={isOnline} />
      <ChatMessages
        messages={messages}
        studentId={studentId!}
        teacherAvatar={teachertInfo?.profilePicture}
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
        setEditingMessageId={(value) => {
          setEditingMessageId(value);
          if (!value) setEditingMessageId(null);
        }}
      />
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} handleTyping={handleTyping} />
    </div>
  );
}
