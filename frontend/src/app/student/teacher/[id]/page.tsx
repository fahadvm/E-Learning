"use client";

import { Suspense } from "react";
import StudentTeacherProfileContent from "@/components/student/teacher/call-schedule/profile-content";

export default function StudentTeacherProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xl">
          Loading Teacher Profile...
        </div>
      }
    >
      <StudentTeacherProfileContent />
    </Suspense>
  );
}
