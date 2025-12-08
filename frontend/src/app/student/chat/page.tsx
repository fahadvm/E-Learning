"use client";

import { useState, useEffect } from "react";
import { ChatLists } from "@/components/student/chat/chat-lists";
import { Input } from "@/components/ui/input";
import { MessageCirclePlus, Search } from "lucide-react";
import Header from "@/components/student/header";
import { studentChatApi } from "@/services/APIservices/studentApiservice";
import Link from "next/link";
import { IConversation } from "@/types/student/chat";

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);

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
