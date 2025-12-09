'use client'

import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Paperclip, Smile, Send, Image as ImageIcon } from 'lucide-react'
import { IChat, IChatMessage } from '@/types/shared/chat'
import { companyChatService } from '@/services/company.chat.service'
import Image from 'next/image'
import { showErrorToast } from '@/utils/Toast'

// Initialize socket outside component to prevent multiple connections
let socket: Socket;

interface CompanyChatWindowProps {
    companyId: string;
    currentUserId: string; // The Company ID logged in
    currentUserType: 'Company' | 'Employee';
}

export default function CompanyChatWindow({ companyId, currentUserId, currentUserType }: CompanyChatWindowProps) {
    const [chat, setChat] = useState<IChat | null>(null)
    const [messages, setMessages] = useState<IChatMessage[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        // Fetch Chat Data
        const fetchChat = async () => {
            try {
                const chatData = await companyChatService.getCompanyGroup(companyId);
                console.log(chatData)
                setChat(chatData);
                if (chatData) {
                    const msgs = await companyChatService.getMessages(chatData._id);
                    setMessages(msgs);
                }
            } catch (error) {
                console.error("Failed to load chat", error);
                showErrorToast("Failed to load group chat");
            }
        };

        fetchChat();
    }, [companyId]);

    useEffect(() => {
        if (!chat) return;

        // Initialize Socket
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
            transports: ['websocket'],
            query: { userId: currentUserId }
        });

        socket.on('connect', () => {
            setIsConnected(true);
            console.log("Connected to socket");
            socket.emit('join_chat', chat._id);
        });

        socket.on('receive_message', (message: IChatMessage) => {
            if (message.chatId === chat._id) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [chat, currentUserId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent, fileUrl?: string, type: 'text' | 'image' | 'file' = 'text') => {
        e?.preventDefault();

        if ((!newMessage.trim() && !fileUrl) || !chat) return;

        const messageContent = fileUrl || newMessage;
        const tempId = 'temp-' + Date.now();

        const msgData = {
            senderId: currentUserId,
            senderType: currentUserType,
            message: messageContent,
            chatId: chat._id,
            type: type,
            fileUrl: fileUrl,
            // receiverId/Type are undefined for group chat broadcasting
        };

        // Optimistic update
        const tempMessage: IChatMessage = {
            _id: tempId,
            ...msgData,
            createdAt: new Date().toISOString(),
        };
        // setMessages((prev) => [...prev, tempMessage]); // Socket will echo back, so maybe wait or dedup?
        // Usually socket emits back to sender too. If we double render, we can dedup by ID.
        // For now, let's allow socket to drive state to ensure sync.

        socket.emit('send_message', msgData);
        setNewMessage('');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const url = await companyChatService.uploadFile(file);
            const type = file.type.startsWith('image/') ? 'image' : 'file';
            await handleSendMessage(undefined, url, type);
        } catch (error) {
            showErrorToast("File upload failed");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!chat) return <div className="flex justify-center items-center h-full">Loading chat...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-slate-50 rounded-lg shadow-sm border border-slate-200">
            {/* Header */}
            <div className="p-4 border-b bg-white rounded-t-lg flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={chat.groupPhoto} />
                    <AvatarFallback>{chat.groupName?.[0] || 'C'}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-semibold text-slate-800">{chat.groupName || 'Company Group'}</h2>
                    <p className="text-xs text-slate-500">{chat.participants?.length || 0} members</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-lg p-3 ${isMe ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
                                {msg.type === 'image' && msg.fileUrl ? (
                                    <div className="relative w-64 h-48 mb-2">
                                        <Image src={msg.fileUrl} alt="Shared image" fill className="object-cover rounded-md" />
                                    </div>
                                ) : msg.type === 'file' && msg.fileUrl ? (
                                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
                                        <Paperclip className="w-4 h-4" />
                                        <span>Download File</span>
                                    </a>
                                ) : (
                                    <p>{msg.message}</p>
                                )}
                                <span className={`text-[10px] block mt-1 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t rounded-b-lg">
                <form onSubmit={(e) => handleSendMessage(e)} className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        <Paperclip className="w-5 h-5 text-slate-500" />
                    </Button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-100 border-none rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button type="submit" disabled={!newMessage.trim() && !isUploading}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
