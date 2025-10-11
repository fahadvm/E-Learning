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

const onlineUsers = new Map<string, string>(); // userId -> socketId

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
  io.use((socket: Socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) return next(new Error("Authentication error: No cookies"));

    const tokenMatch = cookies.match(/(^|;)\s*token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[2] : null;
    if (!token) return next(new Error("Authentication error: No token found"));

    try {
      const payload: TokenPayload = jwt.verify(token, SECRET_KEY) as TokenPayload;
      (socket as AuthenticatedSocket).userId = payload.id;
      (socket as AuthenticatedSocket).role = payload.role;
      next();
    } catch (err) {
      console.error("JWT verification error:", err);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    onlineUsers.set(authSocket.userId, socket.id);
    console.log(" Connected:", authSocket.userId);

    // ==============================
    // 🔹 1. CHAT HANDLING (existing)
    // ==============================
    socket.on("sendMessage", async (data: { receiverId: string; content: string }) => {
      try {
        const senderId = authSocket.userId;
        const { receiverId, content } = data;

        // Save message
        const message = await chatService.sendMessage(senderId, receiverId, content);

        // Deliver to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", message);
        }

        // Echo back to sender
        socket.emit("receiveMessage", message);
      } catch (error) {
        console.error(" Failed to send message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // ==================================
    // 🔹 2. NOTIFICATION HANDLING (new)
    // ==================================
    socket.on("sendNotification", async (data: { receiverId: string; title: string; message: string; type?: string }) => {
      try {
        const { receiverId, title, message, type = "general" } = data;

        // Save to DB (optional)
        await notificationService.createNotification(receiverId, title, message, type);

        // Emit to receiver in real-time if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveNotification", { title, message, type, createdAt: new Date() });
        }

        console.log(` Notification sent to ${receiverId}: ${title}`);
      } catch (error) {
        console.error(" Error sending notification:", error);
        socket.emit("error", { message: "Failed to send notification" });
      }
    });

    // Optionally: mark as read event
    socket.on("markNotificationRead", async (data: { notificationId: string }) => {
      try {
        await notificationService.markAsRead(data.notificationId);
      } catch (error) {
        console.error(" Error marking notification read:", error);
      }
    });

    // ==============================
    // 🔹 3. DISCONNECT HANDLING
    // ==============================
    socket.on("disconnect", () => {
      for (const [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) {
          onlineUsers.delete(uid);
          console.log(" Disconnected:", uid);
          break;
        }
      }
    });
  });
}
