// app/teacher/layout.tsx
'use client';

import { StudentContextProvider } from '@/context/studentContext';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentContextProvider>
      {children}
    </StudentContextProvider>
  );
}
