"use client";

import { Suspense } from "react";
import TeacherProfileContent from "@/components/employee/teacher/TeacherProfileContent";

export default function EmployeeTeacherProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center text-xl">
                    Loading Teacher Profile...
                </div>
            }
        >
            <TeacherProfileContent />
        </Suspense>
    );
}
