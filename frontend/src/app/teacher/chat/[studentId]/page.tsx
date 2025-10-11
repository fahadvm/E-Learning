'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ChatList from '@/components/teacher/chat/ChatList'
import ChatWindow from '@/components/teacher/chat/ChatWindow'
import { initSocket, Message } from '@/lib/socket'
import { teacherChatApi } from '@/services/APImethods/teacherAPImethods'
import { useTeacher } from '@/context/teacherContext'
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
    _id: string
    name: string
    email: string
    profilePicture: string
  }
  teacherId?: string
}

export default function ChatPage() {
  const { teacher } = useTeacher()
  const params = useParams()
  const studentId = params?.studentId as string | undefined

  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [userId, setUserId] = useState('')
  const [socket, setSocket] = useState<ReturnType<typeof initSocket> | null>(null)
  const teacherId = teacher?._id

  useEffect(() => {
    if (!teacher?._id) return

    setUserId(teacher._id)

    const socketInstance = initSocket(teacher._id, (message: Message) => {
      if (selectedChat && message.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, message])
      }
    })
    setSocket(socketInstance)

    const fetchChats = async () => {
      try {
        if(!teacherId) return 
        const response = await teacherChatApi.getuserchat()
        console.log("res of chat ", response.data)
        setChats(response.data)
      } catch (error) {
        console.error('Error fetching chats:', error)
      }
    }

    fetchChats()

    return () => {
      socketInstance.disconnect()
    }
  }, [teacher?._id])



  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat)
    console.log("selectedChat",selectedChat)
    try {
      const response = await teacherChatApi.getmessages(chat._id)
      setMessages(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  if (!teacher?._id) {
    return <div className="text-center mt-10 text-gray-500">Loading teacher chat...</div>
  }

  return (
    <div className="flex h-screen max-w-7xl mx-auto">
      <ChatList
        chats={chats}
        onSelectChat={handleSelectChat}
        currentUserId={userId}
        selectedChatId={selectedChat?._id}
        
      />
      <ChatWindow
        selectedChat={selectedChat}
        messages={messages}
        currentUserId={userId}
        addMessage={(msg) => setMessages((prev) => [...prev, msg])}
      />
    </div>
  )
}
