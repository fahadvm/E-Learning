'use client';

import Link from 'next/link';
import Header from '@/components/teacher/header';
import {
  Mail,
  Phone,
  Globe,
  Linkedin,
  Instagram,
  Twitter,
  CheckCircle,
  XCircle,
  Edit3,
  BadgeCheck,
  UserRound,
  Clock,
  X,
  Upload,
} from 'lucide-react';
import { useTeacher } from '@/context/teacherContext';
import { showSuccessToast, showErrorToast } from '@/utils/Toast';
import { teacherProfileApi } from '@/services/APIservices/teacherApiService';
import { useState } from 'react';

// UI Components from shadcn
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function TeacherProfilePage() {
  const { teacher, setTeacher } = useTeacher();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  if (!teacher) {
    return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;
  }

  // 1️⃣ Handle verification click
  const handleVerificationRequest = async () => {
    setModalOpen(true);
  };

  // 2️⃣ Upload resume handler
  const handleUpload = async () => {
    if (!file) {
      showErrorToast('Please upload a PDF resume.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setLoading(true);
      const res = await teacherProfileApi.sendVerificationRequest(formData); 
      if (res.ok) {
        showSuccessToast('Verification request submitted successfully!');
        setTeacher((prev) => ({
          ...prev!,
          verificationStatus: 'pending',
        }));
        setModalOpen(false);
      } else {
        showErrorToast(res?.data?.message || 'Failed to submit verification.');
      }
    } catch (error) {
      console.log(error)
      showErrorToast('Something went wrong during upload.');
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Helper for rendering status
  const renderVerificationStatus = () => {
    switch (teacher.verificationStatus) {
      case 'verified':
        return (
          <p className="text-sm mt-1 text-green-600 flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" /> Verified Teacher
          </p>
        );
      case 'pending':
        return (
          <p className="text-sm mt-1 text-amber-500 flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" /> Verification Pending
          </p>
        );
      case 'rejected':
        return (
          <p className="text-sm mt-1 text-red-500 flex items-center justify-center gap-1">
            <X className="w-4 h-4" /> Verification Rejected
          </p>
        );
      default:
        return (
          <p className="text-sm mt-1 text-gray-500 flex items-center justify-center gap-1">
            <XCircle className="w-4 h-4" /> Unverified
          </p>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-200">
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={teacher.profilePicture || '/gallery/avatar.jpg'}
                  alt="Profile"
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-cyan-100 shadow-sm"
                />
              </div>

              <h2 className="text-xl font-semibold mt-4 flex items-center justify-center gap-2">
                <UserRound className="w-5 h-5 text-gray-600" />
                {teacher.name}
              </h2>

              {renderVerificationStatus()}

              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/teacher/profile/edit" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white px-5 py-2 rounded-lg hover:bg-cyan-600 transition-all duration-200 shadow-sm">
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                </Link>

                {teacher.verificationStatus === 'unverified' && (
                  <button
                    onClick={handleVerificationRequest}
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 text-white px-5 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-sm disabled:opacity-50"
                  >
                    <BadgeCheck className="w-4 h-4" />
                    Verify Now
                  </button>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex items-center gap-2">
                  <Mail size={16} /> {teacher.email}
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} /> {teacher.phone || 'N/A'}
                </li>
                <li className="flex items-center gap-2">
                  <Globe size={16} /> {teacher.website || 'No website'}
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Social Links</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-blue-700">
                  <Linkedin size={16} /> {teacher.social_links?.linkedin || 'N/A'}
                </li>
                <li className="flex items-center gap-2 text-pink-600">
                  <Instagram size={16} /> {teacher.social_links?.instagram || 'N/A'}
                </li>
                <li className="flex items-center gap-2 text-sky-500">
                  <Twitter size={16} /> {teacher.social_links?.twitter || 'N/A'}
                </li>
              </ul>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Call Schedule</h3>
              <p className="text-sm text-gray-500 mb-3">(GMT +05:30) India</p>
              <ul className="space-y-1 text-sm text-gray-600">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                  (day) => (
                    <li key={day} className="flex justify-between">
                      <span>{day}</span>
                      <span className="text-red-500 font-medium">Closed</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </aside>

          {/* Right Section */}
          <main className="lg:col-span-2 space-y-6">
            {/* About */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">About Me</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {teacher.about || 'No bio added yet.'}
              </p>
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
                    <p className="font-medium text-gray-800">
                      {exp.title} at {exp.company}
                    </p>
                    <p className="text-sm text-gray-500">
                      {exp.from} – {exp.to} ({exp.duration})
                    </p>
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
                    <p className="font-medium text-gray-800">
                      {edu.degree} at {edu.institution}
                    </p>
                    <p className="text-sm text-gray-500">
                      {edu.from} – {edu.to}
                    </p>
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

      {/* 🟢 Resume Upload Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Verification Resume</DialogTitle>
          </DialogHeader>

          <div className="py-3 text-sm text-gray-600">
            Please upload your resume in <b>PDF</b> format. Our team will review it and verify your
            profile.
          </div>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 p-2 rounded-md"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleUpload}>
              <Upload className="w-4 h-4 mr-2" /> {loading ? 'Uploading...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
