"use client"

import { Bell, User, Menu, MessageCircle, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useEmployee } from "@/context/employeeContext"

export function TopNav() {
    const { employee } = useEmployee()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navLinks = [
        { href: "/employee/home", label: "Home" },
        { href: "/employee/learningpath", label: "LearningPath" },
        { href: "/employee/progress", label: "Progress" },
        { href: "/employee/leaderboard", label: "Leaderboard" },
    ]

    return (
        <header className="border-b border-border bg-card sticky top-0 z-50">
            <div className="px-6 py-3 flex items-center justify-between">

                {/* Left Side */}
                <div className="flex items-center gap-10">
                    <Link href="/employee/dashboard" className="font-bold text-xl text-primary">
                        DevNext
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">

                    <Link href="/employee/notifications" passHref>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                        </Button>
                    </Link>

                    <Link href="/employee/chat" passHref>
                        <Button variant="ghost" size="icon" className="relative">
                            <MessageCircle className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                        </Button>
                    </Link>

                    <Link href="/employee/streak" passHref>
                        <Button variant="ghost" size="icon" className="relative">
                            <Flame className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                                {employee?.streakCount}
                            </span>
                        </Button>
                    </Link>

                    <Link href="/employee/profile" passHref>
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                    </Link>


                    {!employee?.companyId && (
                        <Link href="/employee/company" passHref>
                            <Button variant="default" className="hidden sm:flex">
                                Join
                            </Button>
                        </Link>
                    )}

                    {/* Mobile menu toggle */}
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <nav className="md:hidden border-t border-border bg-card px-6 py-4 flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    )
}
