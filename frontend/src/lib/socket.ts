import { showSuccessToast } from "@/utils/Toast";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (
  userId: string,
  onMessageReceived: (data: any) => void = () => { },
  onTypingReceived: (data: { senderId: string }) => void = () => { },
  onMessageRead: (data: { messageId: string; chatId: string }) => void = () => { },
  onMessageReaction: (data: { messageId: string; chatId: string; userId: string; reaction: string }) => void = () => { },
  onMessageDeleted: (data: { messageId: string; chatId: string }) => void = () => { },
  onMessageEdited: (data: { messageId: string; chatId: string; newMessage: string }) => void = () => { }
) => {
  if (!socket) {
    socket = io("http://localhost:8000"); // backend URL
  }

  // Join with userId
  socket.emit("join", userId);

  // Listen for incoming messages
  socket.on("receive_message", onMessageReceived);

  // Listen for typing events
  socket.on("typing", onTypingReceived);

  // Listen for message read events
  socket.on("message_read", onMessageRead);

  // Listen for message reaction events
  socket.on("message_reaction", onMessageReaction);

  // Listen for message deletion events
  socket.on("message_deleted", onMessageDeleted);

  // Listen for message edit events
  socket.on("message_edited", onMessageEdited);

  socket.on("receive_notification", (data) => {
    console.log("🔔 Notification received:", data);
    showSuccessToast(`🔔 ${data.title}: ${data.message}`);
  });

  socket.on("accountBlocked", (data) => {
    console.log("🚫 Account blocked event received:", data);
    alert("Your account has been blocked by the admin. You will be logged out shortly.");

    // Cleanup
    localStorage.clear();
    sessionStorage.clear();

    // Cross-role redirection logic
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/student')) {
      window.location.href = "/student/login";
    } else if (currentPath.startsWith('/teacher')) {
      window.location.href = "/teacher/login";
    } else if (currentPath.startsWith('/company')) {
      window.location.href = "/company/login";
    } else if (currentPath.startsWith('/employee')) {
      window.location.href = "/employee/login";
    } else {
      window.location.href = "/";
    }
  });

  socket.on("courseBlocked", (data: { courseId: string; reason: string; message: string }) => {
    console.log("🚫 Course blocked event received:", data);

    const currentPath = window.location.pathname;
    // Check if user is on this course's detail/learning page
    // Patterns: /student/courses/[id], /employee/courses/[id], /teacher/courses/[id], /company/courses/[id]
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



export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};