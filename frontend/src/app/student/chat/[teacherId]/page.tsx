"use client";

import { Suspense } from "react";
import StudentChatContent from "@/components/student/chat/teacher/chat-content";

export default function StudentChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen text-xl">
          Loading Chat...
        </div>
      }
    >
      <StudentChatContent />
    </Suspense>
  );
}
