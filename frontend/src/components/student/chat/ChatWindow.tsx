'use client'

import { useState, useEffect, useRef } from 'react'
import { sendMessage } from '@/lib/socket'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Video, MoreVertical, Paperclip, Smile } from 'lucide-react'
import Link from 'next/link'
import { ChatMessage } from '@/types/student/chat'

interface User {
    _id: string
    name: string
}

interface Chat {
    _id: string
    participants: string[]
    lastMessage?: string
    teacherId: {
        _id: string
        name: string
        email: string
        profilePicture: string
    }
    studentId?: string
}

interface ChatWindowProps {
    selectedChat: Chat | null
    messages: ChatMessage[]
    currentUserId: string
    addMessage: (message: ChatMessage) => void // for optimistic updates
}

export default function ChatWindow({
    selectedChat,
    messages,
    currentUserId,
    addMessage,
}: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedChat) return

        const receiver = selectedChat.participants.find((p) => p !== currentUserId)
        selectedChat.participants.forEach((p) => {
            console.log("Participant:", p)
        })


        console.log("receiver", receiver)
        console.log("currentUserId", currentUserId)
        if (!receiver) return

        const tempMessage: ChatMessage = {
            _id: 'temp-' + Date.now(),
            chatId: selectedChat._id,
            senderId: currentUserId,
            receiverId: receiver,
            message: newMessage,
            createdAt: new Date().toISOString(),
        }

        // Optimistic UI update
        addMessage(tempMessage)
        setNewMessage('')

        // Send to backend
        sendMessage({
            senderId: currentUserId,
            receiverId: receiver,
            message: tempMessage.message,
            chatId: selectedChat._id,
            senderType: 'Student',
            receiverType: 'Teacher'
        })
    }

    if (!selectedChat?.teacherId.name) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center  text-gray-500 gap-4">
                <img
                    src="/gallery/Startchat.png"
                    alt="No chat selected"
                    className="w-100 h-100 object-contain"
                />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="border-b border-border bg-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/student/chat">
                        <Button variant="ghost" size="sm" className="p-2">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedChat?.teacherId?.profilePicture} alt={selectedChat?.teacherId.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {selectedChat?.teacherId.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="font-semibold text-foreground">{selectedChat?.teacherId.name}</h2>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-2">
                        <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>
            </div>


            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`mb-4 flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`max-w-xs p-3 rounded-lg ${msg.senderId === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            {msg.message}
                            <div className="text-xs mt-1 opacity-70">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2  items-center">
                    <Button variant="ghost" size="sm" className="p-2">
                        <Paperclip className="w-4 h-4" />
                    </Button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type a message..."
                    />
                    <Button variant="ghost" size="sm" className="">
                        <Smile className="w-4 h-4" />
                    </Button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
}
