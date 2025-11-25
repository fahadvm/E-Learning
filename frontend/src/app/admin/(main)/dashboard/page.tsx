'use client'

import AdminSidebar from '@/components/admin/sidebar'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function WelcomePage() {
  const [displayText, setDisplayText] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const fullText = 'Your ultimate e-learning platform'

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index + 1))
      index++
      if (index === fullText.length) clearInterval(interval)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden relative">
      {/* Mobile Hamburger */}
      <button
        className="absolute top-4 left-4 z-50 lg:hidden p-2 bg-gray-900 text-white rounded-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div className="hidden lg:block w-64 h-screen sticky top-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 h-full bg-gray-900 text-white p-6 shadow-lg">
            <div className="flex justify-end mb-4">
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <AdminSidebar />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Page Content */}
      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="relative w-full h-[80vh] md:h-[90vh]">
          <Image
            src="/black-banner.jpg"
            alt="DevNext Welcome"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Welcome to DevNext
            </h1>
            <p className="text-white text-lg sm:text-xl md:text-2xl max-w-2xl">
              {displayText}
            </p>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">It's our DevNext!!!</h2>
          <div className="max-w-6xl mx-auto grid gap-8 px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transform transition duration-300">
              <h3 className="text-2xl font-semibold mb-4">Learn Anytime</h3>
              <p>Access thousands of courses from anywhere, anytime.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transform transition duration-300">
              <h3 className="text-2xl font-semibold mb-4">Expert Teachers</h3>
              <p>Learn from top instructors with real-world experience.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transform transition duration-300">
              <h3 className="text-2xl font-semibold mb-4">Company Learning</h3>
              <p>Corporate training and employee skill tracking made easy.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
