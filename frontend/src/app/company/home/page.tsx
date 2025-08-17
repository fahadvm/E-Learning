"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/componentssss/company/Header";
import Link from "next/link";


export default function CompanyDashboard() {
  const router = useRouter();

  const [metrics, setMetrics] = useState({
    totalCompanies: 15,
    totalStudents: 20,
    activeCourses: 8,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      // You can replace this with real API call
      setMetrics({
        totalCompanies: 15,
        totalStudents: 120,
        activeCourses: 8,
      });
    };
    fetchMetrics();
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-15">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to DevNext</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
            A modern platform to empower employee learning, growth, and engagement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/company/signup"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
            >
              Get Started
            </a>
            <a
              href="/company/signup"
              className="bg-gray-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-600 transition"
            >
              For Companies
            </a>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-4xl font-bold text-gray-800">{metrics.totalCompanies}</h3>
              <p className="text-gray-600 mt-2">Completed Employees</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-4xl font-bold text-gray-800">{metrics.activeCourses}</h3>
              <p className="text-gray-600 mt-2">Active Courses</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-4xl font-bold text-gray-800">{metrics.totalStudents}</h3>
              <p className="text-gray-600 mt-2">Employees </p>
            </div>
          </div>
        </section>

       

        <section className="py-20 px-6 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What You Can Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { title: "👨‍🎓 Employees", desc: "Track progress & enroll in courses.", href: "/company/employees" },
              { title: "📚 Manage Courses", desc: "Organize training paths efficiently.", href: "/company/courses" },
              { title: "🎓 Book Sessions", desc: "1-on-1 expert mentoring sessions.", href: "/company/sessions" },
              { title: "📈 Performance", desc: "Monitor performance and engagement.", href: "/company/analytics" },
              { title: "🗓️ Scheduling", desc: "Timelines for training & tutoring.", href: "/company/schedule" },
              { title: "⚙️ Profiles", desc: "Custom learning experience.", href: "/company/profile" },
            ].map(({ title, desc, href }) => (
              <Link key={title} href={href} className="block group">
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl transition text-center group-hover:scale-[1.02]">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* Inactive Employees Table */}
        <section className="py-20 px-6 bg-gray-100">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">📉 Top 10 Inactive Employees</h2>
          <div className="overflow-x-auto max-w-5xl mx-auto bg-white shadow rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Activity Score</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Riya Sharma", "riya@example.com", 2],
                  ["Aman Gupta", "aman@example.com", 3],
                  ["Sneha Roy", "sneha@example.com", 4],
                  ["Kunal Mehta", "kunal@example.com", 5],
                  ["Divya Nair", "divya@example.com", 6],
                  ["Rahul Jain", "rahul@example.com", 6],
                  ["Anjali Verma", "anjali@example.com", 7],
                  ["Vikas Sinha", "vikas@example.com", 8],
                  ["Pooja Mishra", "pooja@example.com", 9],
                  ["Aditya Reddy", "aditya@example.com", 10],
                ].map(([name, email, score], i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{i + 1}</td>
                    <td className="p-4 text-gray-900">{name}</td>
                    <td className="p-4 text-gray-700">{email}</td>
                    <td className="p-4 text-red-600 font-semibold">{score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="bg-white py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Start your DevNext journey today
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Make your workforce smarter. Equip your company with the best learning tools.
          </p>
          <a
            href="/student/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Get Subscription
          </a>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 text-center">
          <p>&copy; {new Date().getFullYear()} DevNext. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/privacy" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="/terms" className="text-gray-400 hover:text-white">Terms</a>
            <a href="/help" className="text-gray-400 hover:text-white">Help</a>
          </div>
        </footer>
      </main>
    </>
  );
}
