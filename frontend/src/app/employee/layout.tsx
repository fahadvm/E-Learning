import type React from "react"
import { TopNav } from "@/components/employee/top-nav"
import { EmployeeContextProvider } from "@/context/employeeContext"


export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EmployeeContextProvider>
      <div className="flex flex-col h-screen bg-background">
        <TopNav />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </EmployeeContextProvider>
  )
}
