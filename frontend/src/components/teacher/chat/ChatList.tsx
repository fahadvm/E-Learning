'use client'

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Avatar } from "@radix-ui/react-avatar"

interface User {
    _id: string
    name: string
    email: string
}

interface Chat {
    _id: string
    participants: string[]
    lastMessage?: string
    studentId: {
        _id: string,
        name: string,
        email: string,
        profilePicture: string,
    }
    teacherId?: string
}

interface ChatListProps {
    chats: Chat[]
    selectedChatId?: string
    onSelectChat: (chat: Chat) => void
    currentUserId: string
}

export default function ChatList({
    chats,
    selectedChatId,
    onSelectChat,
    currentUserId,
}: ChatListProps) {
    return (
        <div className="w-1/3 bg-white border-r border-gray-200 h-full overflow-y-auto">
            <h2 className="text-xl font-semibold p-4 border-b">Chats</h2>
            {chats.length === 0 ? (
                <div className="p-4 text-gray-500 flex flex-col items-center">
                    <p>No chats available</p>
                </div>
            ) : (
                <ul>
                    {chats.map((chat) => {
                        const otherUser = chat.participants.find((p) => p !== currentUserId)
                        const isSelected = chat._id === selectedChatId
                        return (
                            <li
                                key={chat._id}
                                className={`p-4 hover:bg-gray-100 cursor-pointer border-b ${isSelected ? 'bg-gray-100 font-semibold' : ''
                                    }`}
                                onClick={() => onSelectChat(chat)}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage
                                            src={chat?.studentId?.profilePicture }
                                            alt={chat?.studentId?.name || "Unknown"}
                                        />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {chat?.studentId?.name
                                                ? chat?.studentId?.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Chat Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {chat?.studentId?.name || "Unknown User"}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {chat.lastMessage || "No messages yet"}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
