"use client";

import { Suspense } from "react";
import TeacherChatContent from "@/components/teacher/chat/student/chat-content";

export default function TeacherChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen text-xl">
          Loading Chat...
        </div>
      }
    >
      <TeacherChatContent />
    </Suspense>
  );
}
