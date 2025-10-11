"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Conversation {
  id: string
  lastMessage: string
  teacherId: {
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

export function formatTimeDifference(updatedAt: string | Date): string {
  const updatedTime = new Date(updatedAt)
  const now = new Date()
  const diffMs = now.getTime() - updatedTime.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHr < 24) return `${diffHr} hr ago`
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`
}

export function ChatLists({ conversations, selectedChatId }: ChatListProps) {
  if (conversations.length === 0) {
    return <p className="p-4 text-muted-foreground">No conversations found.</p>
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map((conversation) => {
        const teacher = conversation.teacherId
        const isSelected = selectedChatId === conversation.id

        return (
          <Link
            key={conversation.id}
            href={`/student/chat/${teacher._id}`}
            className={`block hover:bg-muted/50 transition-colors ${isSelected ? "bg-muted/20" : ""}`}
            aria-label={`Chat with ${teacher.name}`}
          >
            <div className="p-4 flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={teacher.profilePicture}
                    alt={teacher.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {teacher.name
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
                    {teacher.name.length > 20 ? teacher.name.slice(0, 17) + "..." : teacher.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeDifference(conversation.updatedAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage || "No messages yet"}
                  </p>

                  {/* {conversation.unread > 0 && (
                                )} */}
                  <Badge className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    5
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
