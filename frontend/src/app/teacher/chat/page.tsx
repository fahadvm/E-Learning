"use client"

import { ChatLists, Conversation } from "@/components/teacher/chat/chat-lists";
import Header from "@/components/teacher/header";
import { Input } from "@/components/ui/input";
import { teacherChatApi } from "@/services/APIservices/teacherApiService";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";






import { attachSocketListener } from "@/lib/socket";

import { useTeacher } from "@/context/teacherContext";

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { teacher } = useTeacher();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await teacherChatApi.getuserchat();
        console.log("chat page listing", response.data)
        setConversations(response.data);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Real-time Chat List Update (WhatsApp Style)
  useEffect(() => {
    if (!teacher?._id) return;

    const cleanup = attachSocketListener("chat-list-update", async (data: { chatId: string, lastMessage: { message: string, senderId: string } }) => {
      setConversations(prev => {
        const index = prev.findIndex(c => c._id === data.chatId);
        if (index !== -1) {
          const isMyMessage = data.lastMessage.senderId === teacher._id;
          const newUnreadCount = isMyMessage ? (prev[index].unread || 0) : (prev[index].unread || 0) + 1;

          const updatedChat = {
            ...prev[index],
            lastMessage: data.lastMessage.message || "New message",
            updatedAt: new Date().toISOString(),
            unread: newUnreadCount
          };
          const newList = [...prev];
          newList.splice(index, 1);
          newList.unshift(updatedChat);
          return newList;
        }
        return prev;
      });

      // Handle new chats (Teacher side)
      try {
        const res = await teacherChatApi.getChatInfo(data.chatId);
        const chatData = res.data;
        if (chatData) {
          setConversations(prev => {
            if (prev.find(c => c._id === data.chatId)) return prev;

            // Map IChat to Conversation (Teacher View)
            const newConversation: Conversation = {
              _id: chatData._id,
              lastMessage: data.lastMessage.message || chatData.lastMessage || "",
              studentId: chatData.studentId, // Assumes populated
              unread: 1,
              online: false,
              updatedAt: new Date().toISOString()
            };
            return [newConversation, ...prev];
          });
        }
      } catch (err) {
        console.error("Failed to fetch new chat details", err);
      }
    });

    // Listen for message read events
    const cleanupRead = attachSocketListener("message_read", (data: { chatId: string }) => {
      setConversations(prev => {
        return prev.map(c => {
          if (c._id === data.chatId) {
            return { ...c, unread: 0 };
          }
          return c;
        });
      });
    });

    return () => {
      cleanup();
      cleanupRead();
    };
  }, [teacher?._id]);

  const filteredConversations = conversations.filter((c) =>
    c.studentId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-input border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-muted-foreground">Loading conversations...</p>
        ) : (
          <ChatLists conversations={filteredConversations} />
        )}
      </div>
    </div>
  );
}
