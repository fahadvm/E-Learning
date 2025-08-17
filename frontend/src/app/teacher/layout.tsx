// app/teacher/layout.tsx
'use client';

import { TeacherContextProvider } from '@/context/teacherContext';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <TeacherContextProvider>
      {children}
    </TeacherContextProvider>
  );
}
