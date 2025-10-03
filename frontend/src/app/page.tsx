// app/page.tsx
"use client"

import Image from "next/image"
import { RoleCard } from "@/components/home/RoleCard"
import { GraduationCap, Users, Building, UserCheck, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const roles = [
    {
      title: "Student",
      description: "Learn at your own pace with thousands of curated courses, interactive lessons, and expert tutors.",
      buttonText: "Continue as Student",
      icon: <GraduationCap size={24} />,
      onClick: () => router.push("/student/login"),
    },
    {
      title: "Teacher",
      description: "Create, manage, and share knowledge. Build your profile and inspire the next generation.",
      buttonText: "Continue as Teacher",
      icon: <Users size={24} />,
      onClick: () => router.push("/teacher/login"),
    },
    {
      title: "Company",
      description: "Empower your workforce with structured learning paths, performance tracking, and corporate training tools.",
      buttonText: "Continue as Company",
      icon: <Building size={24} />,
      onClick: () => router.push("/company/login"),
    },
    {
      title: "Employee",
      description: "Access company-assigned courses, track your learning time, and grow your skills in real time.",
      buttonText: "Continue as Employee",
      icon: <UserCheck size={24} />,
      onClick: () => router.push("/employee/login"),
    },
    {
      title: "Admin",
      description: "Oversee the entire platform, manage users, companies, and ensure seamless operations.",
      buttonText: "Continue as Admin",
      icon: <Settings size={24} />,
      onClick: () => router.push("/admin/login"),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Image */}
       <div className="absolute inset-0 opacity-10 -z-10">
        <Image
          src="/downloadbg.jpeg"   
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 py-16 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-5xl md:text-7xl font-bold bg-gradient-blue bg-clip-text text-transparent">
              Welcome to DevNext
            </h1>
            <p className="mb-12 text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Your all-in-one learning and growth platform. Choose how you want to continue.
            </p>
          </div>
        </section>

        {/* Role Selection */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
              {roles.map((role) => (
                <RoleCard
                  key={role.title}
                  title={role.title}
                  description={role.description}
                  buttonText={role.buttonText}
                  icon={role.icon}
                  onClick={role.onClick}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 text-center border-t border-blue/20">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-muted-foreground">
              © {new Date().getFullYear()} DevNext. All rights reserved.
            </p>
            <p className="text-lg font-medium text-foreground">
              "Shaping the future of learning, one role at a time."
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
