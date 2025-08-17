'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/componentssss/student/header';
import { Mail, Phone, Globe, Linkedin, Instagram, Twitter } from 'lucide-react';
import { useStudent } from '@/context/studentContext';

export default function StudentProfilePage() {
  const { student } = useStudent();

  if (!student) {
    return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;
  }

  return (
    <>
      <Header />

      <div className="bg-gray-50 min-h-screen px-4 sm:px-6 py-10 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <aside className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <img
                src={student.profilePicture || "/gallery/avatar.jpg"}
                alt="Profile"
                width={128}
                height={128}
                className="w-32 h-32 mx-auto rounded-full object-cover border"
              />
              <h2 className="text-xl font-semibold mt-4">{student.name}</h2>
              
              <Link href="/student/profile/edit">
                <button className="mt-4 bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition">
                  Edit Profile
                </button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex items-center gap-2"><Mail size={16} /> {student.email}</li>
                <li className="flex items-center gap-2"><Phone size={16} /> {student.phone || "N/A"}</li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Social Links</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-blue-700"><Linkedin size={16} /> {student.social_links?.linkedin || "N/A"}</li>
                <li className="flex items-center gap-2 text-pink-600"><Instagram size={16} /> {student.social_links?.instagram || "N/A"}</li>
                <li className="flex items-center gap-2 text-sky-500"><Twitter size={16} /> {student.social_links?.twitter || "N/A"}</li>
              </ul>
            </div>
          </aside>

          {/* Right Section */}
          <main className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">About Me</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{student.about || "No description provided."}</p>
            </section>

            {/* Courses */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">My Courses</h3>
              <p className="text-sm text-gray-600">{student.courses || "No courses specified."}</p>
            </section>

            {/* Plan */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">My Plans</h3>
              <p className="text-sm text-gray-600">{student.courses || "No courses specified."}</p>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
