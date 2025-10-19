import { Server, Socket } from "socket.io";
import container from "../core/di/container";
import { TYPES } from "../core/di/types";
import { IChatService } from "../core/interfaces/services/student/IStudentChatService";
import { IStudentNotificationService } from "../core/interfaces/services/student/IStudentNotificationService";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "devnext_jwt_secret";

const chatService = container.get<IChatService>(TYPES.ChatService);
const notificationService = container.get<IStudentNotificationService>(TYPES.StudentNotificationService);



export interface TokenPayload {
  id: string;
  role: string;
}

interface AuthenticatedSocket extends Socket {
  userId: string;
  role: string;
}

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  //  JWT AUTH
  // io.use((socket: Socket, next) => {
  //   const cookies = socket.handshake.headers.cookie;
  //   if (!cookies) return next(new Error("Authentication error: No cookies"));

  //   const tokenMatch = cookies.match(/(^|;)\s*token=([^;]+)/);
  //   const token = tokenMatch ? tokenMatch[2] : null;
  //   if (!token) return next(new Error("Authentication error: No token found"));

  //   try {
  //     const payload: TokenPayload = jwt.verify(token, SECRET_KEY) as TokenPayload;
  //     (socket as AuthenticatedSocket).userId = payload.id;
  //     (socket as AuthenticatedSocket).role = payload.role;
  //     next();
  //   } catch (err) {
  //     console.error("JWT verification error:", err);
  //     next(new Error("Authentication error: Invalid token"));
  //   }
  // });

  // server.ts


  // Map to track online users
  const onlineUsers = new Map<string, string>(); // userId -> socketId

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);


    // When user joins with their ID
    socket.on("join", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log("Online users:", Array.from(onlineUsers.keys()));
    });

    // Listen for messages
    socket.on("send_message", (data: { senderId: string; receiverId: string; message: string }) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", data);
        chatService.sendMessage(data.senderId, data.receiverId, data.message)
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      // Remove from online users
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) onlineUsers.delete(key);
      });
    });
  })
}


