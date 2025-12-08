"use client";

import { Suspense } from "react";
import StudentTeacherSlotPageContent from "@/components/student/teacher/call-schedule/slot-content";

export default function StudentTeacherSlotPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xl">
          Loading Slot Availability...
        </div>
      }
    >
      <StudentTeacherSlotPageContent />
    </Suspense>
  );
}
