'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/teacher/header';
import { Mail, Phone, Globe, Linkedin, Instagram, Twitter } from 'lucide-react';
import { useTeacher } from '@/context/teacherContext';

export default function TeacherProfilePage() {
  const { teacher } = useTeacher();

  if (!teacher) {
    return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;
  }

  return (
    <>
      <Header />

      <div className="bg-gray-50 min-h-screen px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <aside className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <img
                src={teacher.profilePicture || "/gallery/about.jpeg"}
                alt="Profile"
                width={128}
                height={128}
                className="w-32 h-32 mx-auto rounded-full object-cover border"
              />
              <h2 className="text-xl font-semibold mt-4">{teacher.name}</h2>
              <p className={`text-sm ${teacher.isVerified ? 'text-cyan-600' : 'text-red-500'}`}>
                {teacher.isVerified ? "Verified Teacher" : "Unverified"}
              </p>
              <Link href="/teacher/profile/edit">
                <button className="mt-4 bg-cyan-500 text-white px-5 py-2 rounded-lg hover:bg-cyan-600 transition">
                  Edit Profile
                </button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex items-center gap-2"><Mail size={16} /> {teacher.email}</li>
                <li className="flex items-center gap-2"><Phone size={16} /> {teacher.phone || "N/A"}</li>
                <li className="flex items-center gap-2"><Globe size={16} /> {teacher.website || "No website"}</li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Social Links</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-blue-700"><Linkedin size={16} /> {teacher.social_links?.linkedin || "N/A"}</li>
                <li className="flex items-center gap-2 text-pink-600"><Instagram size={16} /> {teacher.social_links?.instagram || "N/A"}</li>
                <li className="flex items-center gap-2 text-sky-500"><Twitter size={16} /> {teacher.social_links?.twitter || "N/A"}</li>
              </ul>
            </div>

            {/* Schedule (Static Placeholder) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Call Schedule</h3>
              <p className="text-sm text-gray-500 mb-3">(GMT +05:30) India</p>
              <ul className="space-y-1 text-sm text-gray-600">
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                  <li key={day} className="flex justify-between">
                    <span>{day}</span>
                    <span className="text-red-500 font-medium">Closed</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right Section */}
          <main className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">About Me</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{teacher.about || "No bio added yet."}</p>
            </section>

            {/* Skills */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">Skills</h3>
              {teacher.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {teacher.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills added.</p>
              )}
            </section>

            {/* Experience */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Experience</h3>
              {teacher.experiences?.length > 0 ? (
                teacher.experiences.map((exp, idx) => (
                  <div key={idx} className="mb-6 border-b pb-4">
                    <p className="font-medium text-gray-800">{exp.title} at {exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.from} – {exp.to} ({exp.duration})</p>
                    <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                  </div>
                  
                ))
              ) : (
                <p className="text-sm text-gray-500">No experiences listed.</p>
              )}
            </section>

            {/* Education */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Education</h3>
              {teacher.education?.length > 0 ? (
                teacher.education.map((edu, idx) => (
                  <div key={idx} className="mb-6 border-b pb-4">
                    <p className="font-medium text-gray-800">{edu.degree} at {edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.from} – {edu.to} </p>
                    <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                  </div>
                ))
                
              ) : (
                <p className="text-sm text-gray-500">No education listed.</p>
              )}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
