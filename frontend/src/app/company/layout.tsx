// app/teacher/layout.tsx
'use client';

import { CompanyContextProvider } from '@/context/companyContext';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompanyContextProvider>
      {children}
    </CompanyContextProvider>
  );
}
