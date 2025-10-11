'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ChatList from '@/components/student/chat/ChatList'
import ChatWindow from '@/components/student/chat/ChatWindow'
import { initSocket, Message } from '@/lib/socket'
import { studentChatApi } from '@/services/APImethods/studentAPImethods'
import { useStudent } from '@/context/studentContext'
import { ChatHeader } from '@/components/student/messages/chat-header'
interface User {
  _id: string
  name: string
  email: string
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

export default function ChatPage() {
  const { student } = useStudent()
  const params = useParams()
  const teacherId = params?.teacherId as string | undefined

  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [userId, setUserId] = useState('')
  const [socket, setSocket] = useState<ReturnType<typeof initSocket> | null>(null)
  const studentId = student?._id

  useEffect(() => {
    if (!student?._id) return

    setUserId(student._id)

    const socketInstance = initSocket(student._id, (message: Message) => {
      if (selectedChat && message.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, message])
      }
    })
    setSocket(socketInstance)

    const fetchChats = async () => {
      try {
        if(!studentId) return 
        const response = await studentChatApi.getuserchat()
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
  }, [student?._id])

  // 🟢 If teacherId exists in URL, start or open that chat
  useEffect(() => {
    if (!teacherId || !userId) return

    const startChat = async () => {
      try {
        const response = await studentChatApi.startChat({ studentId: userId, teacherId })
        const newChat = response.data
        setChats((prev) => {
          const exists = prev.some((c) => c._id === newChat._id)
          return exists ? prev : [...prev, newChat]
        })
        setSelectedChat(newChat)

        // fetch messages
        const msgResponse = await studentChatApi.getmessages(newChat._id)
        setMessages(msgResponse.data)
      } catch (error) {
        console.error('Error starting chat:', error)
      }
    }

    startChat()
  }, [teacherId, userId])

  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat)
    console.log("selectedChat",selectedChat)
    try {
      const response = await studentChatApi.getmessages(chat._id)
      setMessages(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  if (!student?._id) {
    return <div className="text-center mt-10 text-gray-500">Loading student chat...</div>
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
