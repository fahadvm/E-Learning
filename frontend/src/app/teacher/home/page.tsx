"use client";
import React from "react";
import Header from "@/components/teacher/header";

export default function HeroSection() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <div
        className="relative flex items-center justify-center  h-[80vh] sm:h-[90vh] bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/black-banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-start p-4 sm:p-8 md:p-12 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
            Advance Your Career in a Digitalized World
          </h1>
          <p className="mb-6 text-sm sm:text-base md:text-lg">
            We provide you with unrestricted access to the greatest courses from the top specialists, allowing you to learn countless practical lessons in a range of topics.
          </p>

          <div className="flex flex-col sm:flex-row w-full mb-4 gap-2">
            <input
              type="text"
              placeholder="Search course, event or author"
              className="p-3 rounded-md sm:rounded-r-none w-full sm:w-auto flex-1 text-gray-900 outline-none"
            />
            <button className="p-3 bg-cyan-500 rounded-md sm:rounded-l-none w-full sm:w-auto">
              Search
            </button>
          </div>

          <div className="text-sm sm:text-base">
            Popular: <span className="font-medium">UI Design, UX Research, Android, C++</span>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="container mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Management */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Course Management</h2>
          <ul className="space-y-4">
            {["Mathematics 101", "Physics for Beginners", "Advanced Calculus"].map((course) => (
              <li key={course} className="flex justify-between items-center">
                <span>{course}</span>
                <button className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600">Edit</button>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">
            Create New Course
          </button>
        </div>

        {/* Student Progress */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
          <div className="space-y-4">
            {[
              { name: "John Doe", progress: 75 },
              { name: "Jane Smith", progress: 90 },
            ].map((student) => (
              <div key={student.name}>
                <p className="font-medium">{student.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-cyan-600 h-2.5 rounded-full" style={{ width: `${student.progress}%` }}></div>
                </div>
                <p className="text-sm text-gray-600">{student.progress}% Complete</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">
            View All Students
          </button>
        </div>

        {/* Announcements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Announcements</h2>
          <div className="space-y-4">
            {[
              { title: "Midterm Exam Schedule", date: "Aug 18, 2025" },
              { title: "New Assignment Uploaded", date: "Aug 15, 2025" },
            ].map((announcement) => (
              <div key={announcement.title}>
                <p className="font-medium">{announcement.title}</p>
                <p className="text-sm text-gray-600">Posted: {announcement.date}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">
            Post New Announcement
          </button>
        </div>

        {/* Weekly Schedule (full width) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { day: "Monday", schedule: "Math 101: 10 AM - 12 PM" },
              { day: "Tuesday", schedule: "Physics: 1 PM - 3 PM" },
              { day: "Wednesday", schedule: "Calculus: 9 AM - 11 AM" },
              { day: "Thursday", schedule: "Office Hours: 2 PM - 4 PM" },
            ].map((item) => (
              <div key={item.day} className="bg-cyan-100 p-4 rounded-lg">
                <p className="font-medium">{item.day}</p>
                <p className="text-sm">{item.schedule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
