"use client";

import { useState, useEffect } from "react";
import { ChatLists } from "@/components/student/chat/chat-lists";
import { Input } from "@/components/ui/input";
import { MessageCirclePlus, Search } from "lucide-react";
import Header from "@/components/student/header";
import { studentChatApi } from "@/services/APIservices/studentApiservice";
import Link from "next/link";
import { IConversation } from "@/types/student/chat";

import { attachSocketListener } from "@/lib/socket";

import { useStudent } from "@/context/studentContext";

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { student } = useStudent();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await studentChatApi.getuserchat();

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
    if (!student?._id) return;

    const cleanup = attachSocketListener("chat-list-update", async (data: { chatId: string, lastMessage: { message: string, senderId: string } }) => {
      setConversations(prev => {
        const index = prev.findIndex(c => c._id === data.chatId);
        if (index !== -1) {
          // Move to top and update last message
          // Increment unread count if the message is NOT from me
          const isMyMessage = data.lastMessage.senderId === student._id;
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

      // If chat was not found in the immediate previous state, we might need to fetch it.
      // However, we can't reliably check `prev` inside the async callback without refetching logic or better state management.
      // But we can check if it's missing in a separate logic step or optimistically fetch.

      // Let's try to fetch if we suspect it's new. 
      // Note: Since setConversations is state update, checking `conversations` here might use stale closure.
      // A better approach: 
      try {
        const res = await studentChatApi.getChatInfo(data.chatId);
        const chatData = res.data;
        if (chatData) {
          setConversations(prev => {
            if (prev.find(c => c._id === data.chatId)) return prev; // Already handled or exists

            // Map IChat to IConversation
            const newConversation: IConversation = {
              _id: chatData._id,
              lastMessage: data.lastMessage.message || chatData.lastMessage || "",
              teacherId: chatData.teacherId, // Assumes populated
              unread: 1, // Fresh message
              online: false, // TODO: Check online status if possible
              updatedAt: new Date().toISOString()
            };
            return [newConversation, ...prev];
          });
        }
      } catch (err) {
        console.error("Failed to fetch new chat details", err);
      }
    });

    // Listen for message read events to clear unread count
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
  }, [student?._id]);

  const filteredConversations = conversations.filter((c) =>
    c.teacherId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />

      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <Link
            href="/student/chat/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
          >
            <MessageCirclePlus className="w-5 h-5" />
            <span className="hidden sm:inline">New Chat</span>
          </Link>
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
