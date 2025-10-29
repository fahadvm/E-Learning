"use client";
import React, { useState } from "react";
import Header from "@/components/teacher/header";
import { Search, Plus, Edit, Users, Bell, Calendar, TrendingUp, Star } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Header />

      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-40" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: "url('/black-banner.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/40 to-black/70" />

        <div className="relative z-10 container mx-auto px-6 py-24 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-white">Trusted by 50,000+ Educators</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Advance Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Career</span>
                <br />in a Digital World
              </h1>

              <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                Unlock unlimited access to world-class courses from top experts. Master practical skills in UI/UX, programming, data science, and more.
              </p>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, events, or authors..."
                    className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="text-gray-300">Popular:</span>
                {["UI Design", "UX Research", "Android Dev", "C++ Mastery"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 cursor-pointer transition-all"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-purple-600/20 blur-3xl rounded-3xl" />
                <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: TrendingUp, label: "Active Students", value: "2,847" },
                      { icon: Calendar, label: "Courses Live", value: "156" },
                      { icon: Users, label: "Expert Instructors", value: "89" },
                      { icon: Bell, label: "Daily Updates", value: "24/7" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center space-y-2">
                        <stat.icon className="w-8 h-8 mx-auto text-blue-400" />
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-gray-300">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Premium Dashboard Cards */}
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* company progress */}
                     <div className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Company Progress</h3>
                <div className="p-3 bg-purple-500/20 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {[
                  { name: "John Doe", progress: 75, color: "from-blue-400 to-blue-600" },
                  { name: "Jane Smith", progress: 90, color: "from-purple-400 to-pink-600" },
                ].map((student) => (
                  <div key={student.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-200">{student.name}</span>
                      <span className="text-gray-400">{student.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${student.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                View All Company
              </button>
            </div>
          </div>


          {/* Course Management */}
          <div className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Course Management</h3>
                <div className="p-3 bg-blue-500/20 rounded-2xl">
                  <Edit className="w-6 h-6 text-blue-400" />
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {["Mathematics 101", "Physics for Beginners", "Advanced Calculus"].map((course, i) => (
                  <li key={course} className="flex items-center justify-between group/item">
                    <span className="text-gray-200 group-hover/item:text-white transition-colors">{course}</span>
                
                  </li>
                ))}
              </ul>

              <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                View all Courses
              </button>
            </div>
          </div>

          {/* Student Progress */}
          <div className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Student Progress</h3>
                <div className="p-3 bg-purple-500/20 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {[
                  { name: "John Doe", progress: 75, color: "from-blue-400 to-blue-600" },
                  { name: "Jane Smith", progress: 90, color: "from-purple-400 to-pink-600" },
                ].map((student) => (
                  <div key={student.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-200">{student.name}</span>
                      <span className="text-gray-400">{student.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${student.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                View All Students
              </button>
            </div>
          </div>

        </div>

        {/* Weekly Schedule - Full Width */}
        <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Weekly Schedule</h3>
              <Calendar className="w-7 h-7 text-blue-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { day: "Monday", schedule: "Math 101: 10 AM - 12 PM", color: "from-blue-500 to-blue-600" },
                { day: "Tuesday", schedule: "Physics: 1 PM - 3 PM", color: "from-purple-500 to-purple-600" },
                { day: "Wednesday", schedule: "Calculus: 9 AM - 11 AM", color: "from-pink-500 to-pink-600" },
                { day: "Thursday", schedule: "Office Hours: 2 PM - 4 PM", color: "from-amber-500 to-amber-600" },
              ].map((item) => (
                <div
                  key={item.day}
                  className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-300 hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity`} />
                  <div className="relative">
                    <p className="text-lg font-bold text-white mb-1">{item.day}</p>
                    <p className="text-sm text-gray-300">{item.schedule}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* === EARNINGS SECTION === */}
        <section className="container mx-auto px-6 py-16 max-w-7xl">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Earnings</h2>
            <p className="text-gray-400">Track revenue, payouts, and course performance</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Earnings Overview Cards */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Total Earnings", value: "$24,850", change: "+12.5%", color: "from-emerald-500 to-teal-600" },
                { label: "This Month", value: "$4,920", change: "+8.2%", color: "from-cyan-500 to-blue-600" },
                { label: "Pending Payout", value: "$1,200", change: "Ready", color: "from-amber-500 to-orange-600" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity`} />
                  <div className="relative z-10">
                    <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                    <p className={`text-sm mt-2 flex items-center gap-1 ${stat.change.includes('+') ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {stat.change.includes('+') ? <TrendingUp className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                      {stat.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Request Payout Button */}
            <div className="flex items-center justify-center">
              <button className="group relative w-full max-w-xs px-8 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Request Payout</span>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            {/* Earnings Chart */}
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Revenue Trend (Last 6 Months)</h3>
                <select className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-cyan-400">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>

              {/* Mock Chart Bars */}
              <div className="flex items-end justify-between h-64 gap-3">
                {[
                  { month: "Mar", value: 3200, active: false },
                  { month: "Apr", value: 4100, active: false },
                  { month: "May", value: 3800, active: false },
                  { month: "Jun", value: 5200, active: true },
                  { month: "Jul", value: 4900, active: false },
                  { month: "Aug", value: 4920, active: true },
                ].map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative w-full bg-white/10 rounded-t-full overflow-hidden">
                      <div
                        className={`w-full transition-all duration-1000 ease-out rounded-t-full ${data.active ? 'bg-gradient-to-t from-cyan-500 to-cyan-400' : 'bg-gradient-to-t from-gray-600 to-gray-500'
                          }`}
                        style={{ height: `${(data.value / 5500) * 100}%` }}
                      />
                      {data.active && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-white/40 blur-md" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{data.month}</p>
                    <p className="text-xs font-medium text-gray-300">${data.value.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Earning Courses */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Top Earning Courses</h3>
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { course: "Advanced Calculus", earnings: 8420, students: 142, badge: "Top Seller" },
                  { course: "Physics for Beginners", earnings: 6730, students: 98 },
                  { course: "Mathematics 101", earnings: 5700, students: 89 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-cyan-300 transition-colors">{item.course}</p>
                        <p className="text-sm text-gray-400">{item.students} students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">${item.earnings.toLocaleString()}</p>
                      {item.badge && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-300 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-8 w-full py-3 bg-white/10 border border-white/20 text-gray-300 rounded-2xl hover:bg-white/20 hover:border-cyan-400 hover:text-cyan-300 transition-all duration-300 text-sm font-medium">
                View All Courses
              </button>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}