import { showSuccessToast } from "@/utils/Toast";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const eventListeners: Record<string, Function[]> = {};

export const getSocket = () => socket;

const notifyListeners = (event: string, data: any) => {
  if (eventListeners[event]) {
    eventListeners[event].forEach(cb => cb(data));
  }
};

export const on = (event: string, callback: Function) => {
  if (!eventListeners[event]) {
    eventListeners[event] = [];
  }
  eventListeners[event].push(callback);

  // If socket exists, attach immediately (for robustness)
  if (socket && !socket.hasListeners(event)) {
    // This is tricky because we might have multiple callbacks for one event.
    // Better to let 'notifyListeners' handle it if we wrap the socket.on?
    // For now, let's just rely on the existing pattern or direct socket access.
    socket.on(event, (data) => notifyListeners(event, data));
  }
};

export const off = (event: string, callback: Function) => {
  if (eventListeners[event]) {
    eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
  }
};

// Helper for call context to attach internal listeners
export const attachSocketListener = (event: string, callback: (data: any) => void) => {
  if (socket) {
    socket.on(event, callback);
  }
  return () => {
    if (socket) socket.off(event, callback);
  }
};


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
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.devnext.online";
    // Remove /api suffix if present, as socket.io defaults to root + /socket.io
    const socketUrl = rawUrl.replace(/\/api\/?$/, "");

    socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    console.log("Global Socket Initialized");
  }

  // Join with userId
  socket.emit("join", userId);

  // Listen for incoming messages
  socket.on("receive_message", onMessageReceived);

  // Listen for chat list updates (WhatsApp style)
  socket.on("chat-list-update", (data) => {
    notifyListeners("chat-list-update", data);
  });

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

  // ---------------- CALL EVENTS ----------------
  socket.on("incoming-call", (data) => {
    notifyListeners("incoming-call", data);
  });

  socket.on("call-accepted", (data) => {
    notifyListeners("call-accepted", data);
  });

  socket.on("call-rejected", (data) => {
    notifyListeners("call-rejected", data);
  });

  socket.on("call-ended", (data) => {
    notifyListeners("call-ended", data);
  });

  socket.on("ice-candidate", (data: any) => {
    // We might need to handle this globally or pass to specific handler
    // Usually PeerConnection handles this.
    notifyListeners("ice-candidate", data);
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

// -------- CALL FUNCTIONS --------
export const initiateCall = (data: { userToCall: string; signalData: any; from: string; name: string }) => {
  if (socket) socket.emit("call-user", data);
};

export const answerCall = (data: { signal: any; to: string }) => {
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