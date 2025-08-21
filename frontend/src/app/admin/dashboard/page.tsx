'use client'

import AdminSidebar from '@/componentssss/admin/sidebar'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function WelcomePage() {
  const [displayText, setDisplayText] = useState('')
  const fullText = 'Your ultimate e-learning platform'
  // Typewriter effect for headline
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
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 h-full bg-white border-r shadow-sm"><AdminSidebar /></div>
      <div>
        {/* Hero Section */}
        <div className="relative w-full h-screen">
          <Image
            src="/black-banner.jpg"
            alt="DevNext Welcome"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-4">
              Welcome to DevNext
            </h1>
            <p className="text-white text-xl md:text-2xl mb-8">{displayText}</p>

          </div>
        </div>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 text-center">
          <h2 className="text-4xl font-bold mb-12">Its our DevNext!!!</h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transform transition">
              <h3 className="text-2xl font-semibold mb-4">Learn Anytime</h3>
              <p>Access thousands of courses from anywhere, anytime.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transform transition">
              <h3 className="text-2xl font-semibold mb-4">Expert Teachers</h3>
              <p>Learn from top instructors with real-world experience.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transform transition">
              <h3 className="text-2xl font-semibold mb-4">Company Learning</h3>
              <p>Corporate training and employee skill tracking made easy.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
