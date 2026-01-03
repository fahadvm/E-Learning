import { ChatMessage } from "@/types/student/chat";
import { showSuccessToast } from "@/utils/Toast";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const eventListeners: Record<string, ((...args: unknown[]) => void)[]> = {};

export const getSocket = () => socket;

const notifyListeners = (event: string, ...args: unknown[]) => {
  if (eventListeners[event]) {
    eventListeners[event].forEach(cb => cb(...args));
  }
};

export const on = (event: string, callback: (...args: unknown[]) => void) => {
  if (!eventListeners[event]) {
    eventListeners[event] = [];
  }
  eventListeners[event].push(callback);

  // If socket exists, attach immediately (for robustness)
  if (socket && !socket.hasListeners(event)) {
    // Pass all arguments to the notification system
    socket.on(event, (...args: unknown[]) => notifyListeners(event, ...args));
  }
};

export const off = (event: string, callback: (...args: unknown[]) => void) => {
  if (eventListeners[event]) {
    eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
  }
};

// Helper for call context to attach internal listeners
export const attachSocketListener = <T>(event: string, callback: (data: T) => void) => {
  // Use the internal 'on' function so we register interest even if socket is null
  on(event, callback as (...args: unknown[]) => void);

  return () => {
    // Use the internal 'off' function to cleanup
    off(event, callback as (...args: unknown[]) => void);
  }
};


export const initSocket = (
  userId: string,
  onMessageReceived: (data: ChatMessage) => void = () => { },
  onTypingReceived: (data: { senderId: string }) => void = () => { },
  onMessageRead: (data: { messageId: string; chatId: string }) => void = () => { },
  onMessageReaction: (data: { messageId: string; chatId: string; userId: string; reaction: string }) => void = () => { },
  onMessageDeleted: (data: { messageId: string; chatId: string }) => void = () => { },
  onMessageEdited: (data: { messageId: string; chatId: string; newMessage: string }) => void = () => { }
) => {
  if (!socket) {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.devnext.online";
    const socketUrl = rawUrl.replace(/\/api\/?$/, "");

    socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    console.log("Global Socket Initialized");
  }

  // Remove existing listeners to avoid duplicates if initSocket is called multiple times
  socket.removeAllListeners("receive_message");
  socket.removeAllListeners("chat-list-update");
  socket.removeAllListeners("typing");
  socket.removeAllListeners("message_read");
  socket.removeAllListeners("message_reaction");
  socket.removeAllListeners("message_deleted");
  socket.removeAllListeners("message_edited");
  socket.removeAllListeners("receive_notification");
  socket.removeAllListeners("incoming-call");
  socket.removeAllListeners("call-accepted");
  socket.removeAllListeners("call-rejected");
  socket.removeAllListeners("call-ended");
  socket.removeAllListeners("ice-candidate");
  socket.removeAllListeners("onlineUsers");
  socket.removeAllListeners("accountBlocked");
  socket.removeAllListeners("courseBlocked");

  // Join with userId
  socket.emit("join", userId);

  // Re-attach listeners
  socket.on("receive_message", onMessageReceived);
  socket.on("chat-list-update", (...args: unknown[]) => notifyListeners("chat-list-update", ...args));
  socket.on("typing", onTypingReceived);
  socket.on("message_read", onMessageRead);
  socket.on("message_reaction", onMessageReaction);
  socket.on("message_deleted", onMessageDeleted);
  socket.on("message_edited", onMessageEdited);

  socket.on("receive_notification", (data: { title: string; message: string }) => {
    console.log("🔔 Notification received:", data);
    showSuccessToast(`🔔 ${data.title}: ${data.message}`);
  });

  // ---------------- CALL EVENTS ----------------
  socket.on("incoming-call", (data: any) => notifyListeners("incoming-call", data));
  socket.on("call-accepted", (data: any) => notifyListeners("call-accepted", data));
  socket.on("call-rejected", (data: any) => notifyListeners("call-rejected", data));
  socket.on("call-ended", (data: any) => notifyListeners("call-ended", data));
  socket.on("ice-candidate", (data: any) => notifyListeners("ice-candidate", data));

  socket.on("onlineUsers", (users: string[]) => notifyListeners("onlineUsers", users));

  socket.on("accountBlocked", (data: unknown) => {
    console.log("🚫 Account blocked event received:", data);
    alert("Your account has been blocked by the admin. You will be logged out shortly.");
    localStorage.clear();
    sessionStorage.clear();
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/student')) window.location.href = "/student/login";
    else if (currentPath.startsWith('/teacher')) window.location.href = "/teacher/login";
    else if (currentPath.startsWith('/company')) window.location.href = "/company/login";
    else if (currentPath.startsWith('/employee')) window.location.href = "/employee/login";
    else window.location.href = "/";
  });

  socket.on("courseBlocked", (data: { courseId: string; reason: string; message: string }) => {
    const currentPath = window.location.pathname;
    if (currentPath.includes(data.courseId)) {
      alert(`⚠️ This course has been blocked by the admin. Redirecting you to the course list.\nReason: ${data.reason}`);
      if (currentPath.startsWith('/student')) window.location.href = "/student/courses";
      else if (currentPath.startsWith('/teacher')) window.location.href = "/teacher/courses";
      else if (currentPath.startsWith('/employee')) window.location.href = "/employee/my-courses";
      else if (currentPath.startsWith('/company')) window.location.href = "/company/courses";
      else window.location.href = "/";
    }
  });

  socket.on("courseUnblocked", (data: { courseId: string }) => {
    console.log("✅ Course unblocked event received:", data);
  });

  return socket;
};

export const joinChat = (chatId: string) => {
  if (socket) {
    socket.emit("join_chat", chatId);
  }
};

export const sendMessage = (data: { senderId: string; receiverId: string; message: string; chatId: string; senderType: string; receiverType: string }) => {
  if (socket) {
    socket.emit("send_message", data);
  }
};

export const sendTyping = (data: { senderId: string; receiverId: string }) => {
  if (socket) {
    socket.emit("typing", data);
  }
};

export const sendReadMessage = (data: { chatId: string; messageId: string; senderId: string; receiverId: string }) => {
  if (socket) {
    socket.emit("read_message", data);
  }
};

export const sendMessageReaction = (data: { chatId: string; messageId: string; userId: string; reaction: string; receiverId: string }) => {
  if (socket) {
    socket.emit("react_message", data);
  }
};

export const sendDeleteMessage = (data: { chatId: string; messageId: string; senderId: string; receiverId: string }) => {
  if (socket) {
    socket.emit("delete_message", data);
  }
};

export const sendEditMessage = (data: { chatId: string; messageId: string; senderId: string; newMessage: string; receiverId: string }) => {
  if (socket) {
    socket.emit("edit_message", data);
  }
};
export const sendNotification = (data: { receiverId: string; title: string; message: string; }) => {
  if (socket) {
    console.log("emiting send notification here")
    socket.emit("send_notification", data);
  }
};

// -------- CALL FUNCTIONS --------
export const initiateCall = (data: { userToCall: string; signalData: unknown; from: string; name: string }) => {
  if (socket) socket.emit("call-user", data);
};

export const answerCall = (data: { signal: unknown; to: string }) => {
  if (socket) socket.emit("answer-call", data);
};

export const rejectCall = (data: { to: string }) => {
  if (socket) socket.emit("reject-call", data);
};

export const endCall = (data: { to: string }) => {
  if (socket) socket.emit("end-call", data);
};


export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};