"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatChatTime } from "@/utils/timeConverter"

export interface Conversation {
  _id: string
  lastMessage: string
  studentId: {
    _id: string
    name: string
    profilePicture?: string
  }
  unread: number
  online: boolean
  updatedAt: string
}

interface ChatListProps {
  conversations: Conversation[]
  selectedChatId?: string
}

export function ChatLists({ conversations, selectedChatId }: ChatListProps) {
  if (conversations.length === 0) {
    return <p className="p-4 text-muted-foreground">No conversations found.</p>
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map((conversation) => {
        const student = conversation.studentId
        const isSelected = selectedChatId === conversation._id

        return (
          <Link
            key={conversation._id}
            href={`/teacher/chat/${student._id}?chatId=${conversation._id}`}
            className={`block hover:bg-muted/50 transition-colors ${isSelected ? "bg-muted/20" : ""}`}
            aria-label={`Chat with ${student.name}`}
          >
            <div className="p-4 flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={student.profilePicture}
                    alt={student.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {conversation && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {student.name.length > 20 ? student.name.slice(0, 17) + "..." : student.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {formatChatTime(conversation.updatedAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage || "No messages yet"}
                  </p>

                  {conversation.unread > 0 && (
                    <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
