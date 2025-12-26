import { io, Socket } from "socket.io-client";


const url = (process.env.NEXT_PUBLIC_API_URL || "https://api.devnext.online").replace(/\/api\/?$/, "");

export const socket: Socket = io(url, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});