"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, Globe, Linkedin, Instagram, Twitter, Star, Book, MessageSquare, GraduationCap, Briefcase } from "lucide-react";
import { studentTeacherApi } from "@/services/APIservices/studentApiservice";
import Header from "@/components/student/header";
import { useSearchParams } from "next/navigation";



const staticReviews = [
  { id: 1, studentName: "Alice Smith", rating: 4.5, comment: "Great teacher! Explained complex topics clearly.", date: "Sep 15, 2025" },
  { id: 2, studentName: "Bob Johnson", rating: 5, comment: "Very patient and knowledgeable.", date: "Sep 10, 2025" },
];

export default function StudentTeacherProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const teacherId = params?.id as string;
  const courseId = searchParams.get("courseId");



  const [teacher, setTeacher] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>(staticReviews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teacherId) return;

    const fetchTeacherData = async () => {
      try {
        setLoading(true);

        // Fetch profile

        const profileRes = await studentTeacherApi.getTeacherDetails(teacherId)


        setTeacher(profileRes.data);

        // Fetch availability
        const availabilityRes = await studentTeacherApi.getTeacherAvailability(teacherId);
        setAvailability(availabilityRes.data.week);

        // Fetch reviews (optional)
        // const reviewsRes = await axios.get(`/api/student/teacher/reviews/${teacherId}`);
        // setReviews(reviewsRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch teacher data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!teacher) return <div className="text-center mt-10 text-gray-500">Teacher not found</div>;

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const handleChat = () => router.push(`/student/chat/${teacherId}`);
  const handleBookSession = () => router.push(`/student/teacher/call-shedule/${teacherId}?courseId=${courseId}`);
  const hasValidCourse = !!courseId; 


  return (
    <>
      <Header />
      <div className="bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen px-4 sm:px-6 py-10">

        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Teacher Profile</h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 text-center bg-gradient-to-r from-white to-gray-50">
                <Image
                  src={teacher.profilePicture || "/gallery/avatar.jpg"}
                  alt="Teacher Profile"
                  width={128}
                  height={128}
                  className="w-32 h-32 mx-auto rounded-full object-cover border-2 border-blue-200"
                />
                <h2 className="text-xl font-semibold mt-4 text-gray-800">{teacher.name || "N/A"}</h2>
                <p className={`text-sm ${teacher.isVerified ? "text-blue-600" : "text-red-500"}`}>
                  {teacher.isVerified ? "Verified Teacher" : "Unverified"}
                </p>
                <div className="mt-4 flex justify-center items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={18}
                        className={idx < Math.round(Number(averageRating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({averageRating} / 5)</span>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  {hasValidCourse ? (
                    <button
                      onClick={handleChat}
                      className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                    >
                      <MessageSquare size={18} /> Chat
                    </button>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Chat available after course purchase</p>
                  )}
                </div>

              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact</h3>
                <ul className="space-y-3 text-gray-700 text-sm">
                  <li className="flex items-center gap-2"><Mail size={16} /> {teacher.email || "N/A"}</li>
                  <li className="flex items-center gap-2"><Phone size={16} /> {teacher.phone || "N/A"}</li>
                  <li className="flex items-center gap-2"><Globe size={16} /> {teacher.website || "N/A"}</li>
                </ul>
              </div>

              {/* Availability */}
              {hasValidCourse && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-semibold text-lg mb-4">Call Schedule</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {availability.length > 0 ? availability.map((a: any) => (
                      <li key={a.day} className="flex justify-between">
                        <span>{a.day}</span>
                        <span
                          className={`font-medium ${a.slots.length === 0 ? "text-red-500" : "text-green-500"
                            }`}
                        >
                          {a.slots.length === 0 ? "No slots" : `${a.slots.length} slots`}
                        </span>
                      </li>
                    )) : (
                      ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                        <li key={day} className="flex justify-between">
                          <span>{day}</span>
                          <span className="text-red-500 font-medium">Not Available</span>
                        </li>
                      ))
                    )}
                  </ul>
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      onClick={handleBookSession}
                      className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                    >
                      <Book size={18} /> Book Session
                    </button>
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Social Links</h3>
                <ul className="space-y-3 text-sm">
                  {teacher.social_links?.linkedin && <li className="flex items-center gap-2 text-blue-700"><Linkedin size={16} /><a href={teacher.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a></li>}
                  {teacher.social_links?.instagram && <li className="flex items-center gap-2 text-pink-600"><Instagram size={16} /><a href={teacher.social_links.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>}
                  {teacher.social_links?.twitter && <li className="flex items-center gap-2 text-sky-500"><Twitter size={16} /><a href={teacher.social_links.twitter} target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a></li>}
                </ul>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-2 space-y-6">
              {/* About */}
              <section className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2"><Book size={18} /> About Me</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{teacher.about || "No bio provided."}</p>
              </section>

              {/* Skills */}
              <section className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2"><Star size={18} /> Skills</h3>
                {teacher.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {teacher.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{skill}</span>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500">No skills listed.</p>}
              </section>

              {/* Experience */}
              <section className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2"><Briefcase size={18} /> Experience</h3>
                {teacher.experiences?.length > 0 ? teacher.experiences.map((exp: any, idx: number) => (
                  <div key={idx} className="mb-6 border-b pb-4 last:border-b-0">
                    <p className="font-medium text-gray-800">{exp.title} at {exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.from} – {exp.to} ({exp.duration})</p>
                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                  </div>
                )) : <p className="text-sm text-gray-500">No experiences listed.</p>}
              </section>

              {/* Education */}
              <section className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2"><GraduationCap size={18} /> Education</h3>
                {teacher.education?.length > 0 ? teacher.education.map((edu: any, idx: number) => (
                  <div key={idx} className="mb-6 border-b pb-4 last:border-b-0">
                    <p className="font-medium text-gray-800">{edu.degree} at {edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.from} – {edu.to}</p>
                    <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                  </div>
                )) : <p className="text-sm text-gray-500">No education listed.</p>}
              </section>

              {/* Reviews */}
              <section className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2"><Star size={18} /> Student Reviews</h3>
                {reviews.length > 0 ? reviews.map((rev: any) => (
                  <div key={rev.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-800">{rev.studentName}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} size={16} className={idx < Math.round(rev.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{rev.comment}</p>
                    <p className="text-xs text-gray-500 mt-1">{rev.date}</p>
                  </div>
                )) : <p className="text-sm text-gray-500">No reviews yet.</p>}
              </section>
            </main>
          </div>
        </div>
      </div>
    </>

  );
}
