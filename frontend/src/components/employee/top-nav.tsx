"use client"

import { Bell, Search, User, Menu ,MessageCircle} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"

export function TopNav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navLinks = [
        { href: "/employee/home", label: "Dashboard" },
        { href: "/employee/mycourses", label: "Courses" },
        { href: "/employee/progress", label: "Progress" },
        { href: "/employee/company", label: "Company" },
        { href: "/employee/leaderboard", label: "Leaderboard" },
    ]

    return (
        <header className="border-b border-border bg-card sticky top-0 z-50">
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/employee/dashboard" className="font-bold text-lg text-primary">
                        DevNext
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
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

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Search - Hidden on mobile */}
                    <div className="hidden sm:block flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search courses, progress..." className="pl-10" />
                        </div>
                    </div>

                    {/* Icons */}
                    {/* Notifications */}
                    <Link href="/employee/notifications" passHref>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
                        </Button>
                    </Link>

                    {/* chat */}
                    <Link href="/employee/chat" passHref>
                        <Button variant="ghost" size="icon" className="relative">
                            <MessageCircle className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
                        </Button>
                    </Link>

                    {/* Profile */}
                    <Link href="/employee/profile" passHref>
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                    </Link>
                

                {/* Mobile Menu Button */}
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <Menu className="h-5 w-5" />
                </Button>
            </div>
        </div>

      {/* Mobile Navigation Menu */ }
    {
        mobileMenuOpen && (
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
        )
    }
    </header >
  )
}
