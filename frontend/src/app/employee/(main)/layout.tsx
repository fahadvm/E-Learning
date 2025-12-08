"use client";


import { TopNav } from "@/components/employee/top-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen bg-background">
            <TopNav />
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}
