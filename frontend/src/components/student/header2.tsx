'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/provider';
import {
  BookOpen,
  Menu,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  X,
} from 'lucide-react';

interface HeaderProps {
  userRole?: 'student' | 'teacher' | 'company' | 'employee' | 'admin';
  isLoggedIn?: boolean;
}

export default function Header({ userRole, isLoggedIn = false }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const roleBasedNavigation = {
    student: [
      { name: 'Browse Courses', href: '/courses' },
      { name: 'My Learning', href: '/student/dashboard' },
      { name: 'Live Classes', href: '/live-classes' },
      { name: 'Compiler', href: '/compiler' },
    ],
    teacher: [
      { name: 'My Courses', href: '/teacher/courses' },
      { name: 'Create Course', href: '/teacher/create-course' },
      { name: 'Live Classes', href: '/teacher/live-classes' },
      { name: 'Students', href: '/teacher/students' },
    ],
    company: [
      { name: 'Dashboard', href: '/company/dashboard' },
      { name: 'Employees', href: '/company/employees' },
      { name: 'Course Library', href: '/company/courses' },
      { name: 'Analytics', href: '/company/analytics' },
    ],
    employee: [
      { name: 'My Courses', href: '/employee/courses' },
      { name: 'Learning Progress', href: '/employee/progress' },
      { name: 'Live Sessions', href: '/employee/live-sessions' },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin/dashboard' },
      { name: 'Users', href: '/admin/users' },
      { name: 'Courses', href: '/admin/courses' },
      { name: 'Analytics', href: '/admin/analytics' },
    ],
  };

  const navigation = isLoggedIn && userRole ? roleBasedNavigation[userRole] : [
    { name: 'Courses', href: '/courses' },
    { name: 'For Business', href: '/business' },
    { name: 'Become Instructor', href: '/become-instructor' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="link-logo">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">DevNext</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid={`link-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User actions */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <Button variant="ghost" size="icon" data-testid="button-notifications">
                  <Bell className="h-5 w-5" />
                </Button>

                {/* User menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    data-testid="button-user-menu"
                  >
                    <User className="h-5 w-5" />
                  </Button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-popover border">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                          data-testid="link-profile"
                        >
                          <User className="mr-3 h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                          data-testid="link-settings"
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Settings
                        </Link>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                          data-testid="button-logout"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild data-testid="button-login">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild data-testid="button-signup">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <nav className="container px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  data-testid={`link-mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}