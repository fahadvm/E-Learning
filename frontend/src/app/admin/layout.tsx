"use client"

import { AdminContextProvider } from "@/context/adminContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminContextProvider>
      {children}
    </AdminContextProvider>
  );
}
