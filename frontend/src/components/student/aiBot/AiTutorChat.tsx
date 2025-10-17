"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizonal, Bot, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentAiApi } from "@/services/APImethods/studentAPImethods";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import type { Components } from "react-markdown";

interface AiTutorChatProps {
  courseId: string;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

interface ApiResponse {
  data?: string;
}

export default function AiTutorChat({ courseId }: AiTutorChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || input.length > 500) return;
    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res: ApiResponse = await studentAiApi.aiAssistant(courseId, { prompt: userMessage.text });
      const aiMessage: Message = {
        role: "ai",
        text: typeof res.data === "string" && res.data.trim()
          ? res.data
          : "I'm sorry, I couldn't process that.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("AI API error:", error);
      const aiMessage: Message = {
        role: "ai",
        text: "Something went wrong. Please try again later.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          aria-label="Open AI Study Assistant"
          className="fixed bottom-5 right-5 rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-transform"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      )}

      {open && (
        <Card className="fixed bottom-5 right-5 w-80 sm:w-96 max-w-[90vw] shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Study Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={clearChat}
                aria-label="Clear chat"
                variant="ghost"
                size="sm"
                className="text-white hover:text-gray-200"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
              <X
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="h-5 w-5 cursor-pointer hover:text-gray-200 transition"
              />
            </div>
          </CardHeader>

          <CardContent className="p-3 flex flex-col h-96 bg-gray-50">
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 pr-2">
              {messages.length === 0 && (
                <div className="text-gray-500 text-sm text-center mt-20 animate-pulse">
                  Ask me anything about this course 👇
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-[85%] sm:max-w-[70%] whitespace-pre-wrap break-words leading-relaxed text-sm ${msg.role === "user"
                      ? "bg-blue-600 text-white self-end ml-auto"
                      : "bg-white border text-gray-800"
                    }`}
                >
                  <ReactMarkdown
                    rehypePlugins={[rehypeSanitize]}
                    components={{
                      code: ({ node, inline, className, children, ...props }: {
                        node: any;
                        inline?: boolean;
                        className?: string;
                        children: React.ReactNode;
                      }) => (
                        <code
                          className={`bg-gray-100 px-1 rounded text-sm ${inline ? "" : "block overflow-x-auto p-2"}`}
                          {...props}
                        >
                          {children}
                        </code>
                      ),
                      li: ({ children, ...props }) => (
                        <li className="ml-4 list-disc" {...props}>
                          {children}
                        </li>
                      ),
                      p: ({ children, ...props }) => (
                        <p className="my-1" {...props}>{children}</p>
                      ),
                    } as Components}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={input}
                placeholder="Type your question..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
                maxLength={500}
                className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                aria-label="Type your question"
              />
              <Button
                onClick={sendMessage}
                disabled={loading}
                aria-label="Send message"
                className="h-9 w-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <SendHorizonal className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}