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
  Shield,
  Lock,
  Key,
  RefreshCw,
  MailWarning,
  Eye,
  EyeOff,
  Calendar
} from 'lucide-react';
import { useTeacher } from '@/context/teacherContext';
import { showSuccessToast, showErrorToast } from '@/utils/Toast';
import { teacherProfileApi, teacherAvailabilityApi } from '@/services/APIservices/teacherApiService';
import { useState, useEffect } from 'react';

interface ITimeSlot {
  start: string;
  end: string;
}

interface IDayAvailability {
  day: string;
  enabled: boolean;
  slots: ITimeSlot[];
}

// UI Components from shadcn
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type TabType = 'overview' | 'security' | 'experience';

interface IReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  studentId?: {
    name: string;
    profilePicture?: string;
  };
}

export default function TeacherProfilePage() {
  const { teacher, setTeacher } = useTeacher();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);

  // Password state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Email state
  const [emailData, setEmailData] = useState({
    newEmail: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [availability, setAvailability] = useState<IDayAvailability[]>([]);

  // Fetch availability data
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await teacherAvailabilityApi.getAvailability();
        if (res && res.data && res.data.week) {
          setAvailability(res.data.week);
        }
      } catch (error) {
        console.error('Failed to fetch availability:', error);
      }
    };

    if (teacher) {
      fetchAvailability();
    }
  }, [teacher]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (teacher?._id) {
        try {
          const res = await teacherProfileApi.getTeacherReviews(teacher._id);
          if (res.ok) {
            setReviews(res.data);
          }
        } catch (error) {
          console.error('Failed to fetch reviews:', error);
        }
      }
    };

    fetchReviews();
  }, [teacher]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!teacher) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 font-medium tracking-tight">Loading your profile...</p>
      </div>
    );
  }

  const handleVerificationRequest = () => setModalOpen(true);

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
        showErrorToast(res?.message || 'Failed to submit verification.');
      }
    } catch {
      showErrorToast('Something went wrong during upload.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const res = await teacherProfileApi.changePassword(passwordData);
      if (res.ok) {
        showSuccessToast('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch {
      showErrorToast('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!emailData.newEmail) {
      showErrorToast('Please enter a new email address');
      return;
    }
    try {
      setLoading(true);
      const res = await teacherProfileApi.sendChangeEmailOtp({ newEmail: emailData.newEmail });
      if (res.ok) {
        showSuccessToast('OTP sent to your new email');
        setOtpSent(true);
        setTimer(60);
      }
    } catch {
      showErrorToast('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailData.otp) {
      showErrorToast('Please enter the OTP');
      return;
    }
    try {
      setLoading(true);
      const res = await teacherProfileApi.verifyChangeEmail(emailData);
      if (res.ok) {
        showSuccessToast('Email updated successfully');
        setTeacher({ ...teacher, email: emailData.newEmail });
        setOtpSent(false);
        setEmailData({ newEmail: '', otp: '' });
      }
    } catch {
      showErrorToast('Invalid OTP or verification failed');
    } finally {
      setLoading(false);
    }
  };

  const renderVerificationStatus = () => {
    switch (teacher.verificationStatus) {
      case 'verified':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold ring-1 ring-emerald-600/10">
            <CheckCircle className="w-3.5 h-3.5" /> Verified Instructor
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-bold ring-1 ring-amber-600/10">
            <Clock className="w-3.5 h-3.5" /> Verification Pending
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold ring-1 ring-red-600/10">
            <XCircle className="w-3.5 h-3.5" /> Verification Rejected
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-600 text-xs font-bold ring-1 ring-gray-600/10">
            <XCircle className="w-3.5 h-3.5" /> Unverified Profile
          </div>
        );
    }
  };





  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-black selection:text-white">
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-10 max-w-7xl pt-10">
        {/* Profile Header Card */}
        <div className="relative mb-8 bg-white border border-gray-200 rounded-[2rem] p-8 md:p-12 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100 rounded-full blur-[100px] -mr-32 -mt-32" />

          <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gray-200 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <img
                src={teacher.profilePicture || '/gallery/avatar.jpg'}
                alt={teacher.name}
                className="relative w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <h1 className="text-4xl font-black tracking-tight text-gray-900">{teacher.name}</h1>
                {renderVerificationStatus()}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500 text-sm mb-8 font-medium">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-black" /> {teacher.email}
                </span>
                {teacher.phone && (
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-black" /> {teacher.phone}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-black" /> {teacher.website || 'No website'}
                </span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Link href="/teacher/profile/edit">
                  <button className="flex items-center gap-2 bg-black hover:bg-zinc-800 text-white px-8 py-3 rounded-xl transition-all font-bold text-sm shadow-lg shadow-black/10">
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                </Link>
                {teacher.verificationStatus === 'unverified' && (
                  <button
                    onClick={handleVerificationRequest}
                    disabled={loading}
                    className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-black px-8 py-3 rounded-xl transition-all font-bold text-sm border border-zinc-200 disabled:opacity-50"
                  >
                    <BadgeCheck className="w-4 h-4" /> Verify Identity
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-10 bg-white p-1.5 rounded-2xl w-fit border border-gray-200 mx-auto md:mx-0 shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: UserRound },
            { id: 'experience', label: 'Career & Skills', icon: BadgeCheck },
            { id: 'security', label: 'Security & Settings', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                ? 'bg-black text-white shadow-xl shadow-black/20'
                : 'text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {activeTab === 'overview' && (
              <>
                <section className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-900 uppercase tracking-tight">
                    <div className="p-2 bg-black rounded-lg">
                      <UserRound className="w-5 h-5 text-white" />
                    </div>
                    Bio & About
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line font-medium">
                    {teacher.about || 'No bio provided. Share your journey with your students!'}
                  </p>
                </section>



                <section className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-900 uppercase tracking-tight">
                    <div className="p-2 bg-black rounded-lg">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    Digital Presence
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-6">
                    {[
                      { icon: Linkedin, label: 'LinkedIn', color: 'text-blue-600', value: teacher.social_links?.linkedin },
                      { icon: Twitter, label: 'Twitter', color: 'text-sky-500', value: teacher.social_links?.twitter },
                      { icon: Instagram, label: 'Instagram', color: 'text-pink-600', value: teacher.social_links?.instagram },
                    ].map((social, i) => (
                      <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 transition-all hover:border-black hover:bg-white group">
                        <social.icon className={`w-6 h-6 ${social.color} mb-4 transition-transform group-hover:scale-110`} />
                        <div className="min-w-0">
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{social.label}</p>
                          <p className="text-sm text-gray-900 font-bold truncate">{social.value || 'Not linked'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900 uppercase tracking-tight">
                    <div className="p-2 bg-black rounded-lg">
                      <BadgeCheck className="w-5 h-5 text-white" />
                    </div>
                    Student Reviews
                  </h3>

                  {/* LIMITED HEIGHT */}
                  <div className="space-y-6 max-h-[320px] overflow-y-auto pr-2">
                    {reviews.length > 0 ? (
                      reviews.map((review: IReview) => (
                        <div
                          key={review._id}
                          className="border border-gray-200 rounded-2xl p-6 hover:border-black transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-black text-gray-900">
                                {review.studentId?.name || 'Anonymous'}
                              </p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                Student · {new Date(review.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>

                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${i < review.rating ? 'text-black' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>

                          <p className="text-gray-600 font-medium leading-relaxed">
                            “{review.comment}”
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No reviews yet.</p>
                      </div>
                    )}
                  </div>
                </section>

              </>
            )}

            {activeTab === 'experience' && (
              <>
                <section className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-900 uppercase tracking-tight">
                    <div className="p-2 bg-black rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    Professional Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {teacher.skills?.length > 0 ? (
                      teacher.skills.map((skill, i) => (
                        <span key={i} className="bg-zinc-100 border border-zinc-200 text-black px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-black hover:text-white transition-colors cursor-default">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm font-medium italic">No skills specified yet.</p>
                    )}
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                  <h3 className="text-xl font-black mb-10 flex items-center gap-3 text-gray-900 uppercase tracking-tight">
                    <div className="p-2 bg-black rounded-lg">
                      <BadgeCheck className="w-5 h-5 text-white" />
                    </div>
                    Working Experience
                  </h3>
                  <div className="space-y-10">
                    {teacher.experiences?.length > 0 ? (
                      teacher.experiences.map((exp, i) => (
                        <div key={i} className="relative pl-10 border-l-2 border-zinc-100 pb-10 last:pb-0">
                          <div className="absolute left-[-1px] top-0 w-3 h-3 rounded-full bg-black -translate-x-1/2 ring-4 ring-white shadow-sm" />
                          <h4 className="text-xl font-black text-gray-900 tracking-tight">{exp.title}</h4>
                          <p className="text-gray-500 font-bold mb-3">{exp.company}</p>
                          <p className="text-xs text-gray-400 mb-4 flex items-center gap-2 font-black uppercase tracking-widest">
                            <Clock className="w-3 h-3" /> {exp.from} — {exp.to} ({exp.duration})
                          </p>
                          <p className="text-gray-600 leading-relaxed font-medium">{exp.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm font-medium italic">No experience added.</p>
                    )}
                  </div>
                </section>
              </>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10">
                {/* Change Password */}
                <section className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 text-zinc-50 pointer-events-none">
                    <Lock size={140} strokeWidth={1} />
                  </div>
                  <h3 className="text-xl font-black mb-10 flex items-center gap-3 text-gray-900 uppercase tracking-tight">
                    <div className="p-2 bg-black rounded-lg">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    Security Settings
                  </h3>

                  <form onSubmit={handlePasswordChange} className="space-y-8 max-w-xl relative lg:z-10">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest block ml-1">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-300"
                          placeholder="Your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest block ml-1">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-300"
                            placeholder="New password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                          >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest block ml-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-300"
                          placeholder="Re-type password"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-black hover:bg-zinc-800 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-black/10 disabled:opacity-50 flex items-center gap-3 text-sm uppercase tracking-widest"
                    >
                      {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : 'Update Security'}
                    </button>
                  </form>
                </section>

                {/* Account Settings / Email Change */}
                <section className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 text-zinc-50 pointer-events-none">
                    <Mail size={140} strokeWidth={1} />
                  </div>
                  <h3 className="text-xl font-black mb-10 flex items-center gap-3 text-gray-900 uppercase tracking-tight">
                    <div className="p-2 bg-black rounded-lg">
                      <RefreshCw className="w-5 h-5 text-white" />
                    </div>
                    Account Identity
                  </h3>

                  <div className="max-w-xl space-y-8 relative lg:z-10">
                    <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-3xl flex items-start gap-5">
                      <div className="p-3 bg-black rounded-2xl shrink-0">
                        <MailWarning size={20} className="text-white" />
                      </div>
                      <div className="text-sm">
                        <p className="font-black text-gray-900 mb-1 tracking-tight">Current Email: {teacher.email}</p>
                        <p className="text-gray-500 font-medium">Updating your primary email requires OTP verification for security.</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {!otpSent ? (
                        <div className="space-y-3">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block ml-1">New Email Address</label>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <input
                              type="email"
                              value={emailData.newEmail}
                              onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                              className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-300"
                              placeholder="johndoe@example.com"
                            />
                            <button
                              onClick={handleSendOtp}
                              disabled={loading || !emailData.newEmail}
                              className="bg-black hover:bg-zinc-800 text-white px-8 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-black/10 shrink-0"
                            >
                              Send OTP
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-8 animate-fade-in">
                          <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block ml-1">Verification Code</label>
                            <input
                              type="text"
                              maxLength={6}
                              value={emailData.otp}
                              onChange={(e) => setEmailData({ ...emailData, otp: e.target.value })}
                              className="w-full bg-white border-2 border-zinc-900 rounded-2xl px-6 py-6 text-center text-4xl font-black tracking-[1.5rem] focus:ring-8 ring-black/5 outline-none transition-all placeholder:tracking-normal placeholder:text-sm placeholder:font-black placeholder:text-zinc-200"
                              placeholder="000000"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button
                              onClick={handleVerifyEmail}
                              disabled={loading || emailData.otp.length < 6}
                              className="w-full bg-black hover:bg-zinc-800 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-black/20 disabled:opacity-50 text-sm uppercase tracking-widest"
                            >
                              Confirm Identifier Change
                            </button>
                            <button
                              className="w-full sm:w-auto bg-gray-100 hover:bg-red-50 border border-gray-200 p-5 rounded-2xl transition-all group font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                              onClick={() => { setOtpSent(false); setEmailData({ ...emailData, otp: '' }); }}
                            >
                              <X className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" />
                              <span className="text-gray-500 group-hover:text-red-500 transition-colors">Abort</span>
                            </button>
                          </div>

                          <div className="text-center">
                            {timer > 0 ? (
                              <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Resend possible in <span className="text-black">{timer}s</span></p>
                            ) : (
                              <button
                                onClick={handleSendOtp}
                                className="text-xs text-black hover:underline font-black uppercase tracking-widest underline-offset-8"
                              >
                                Re-issue Security Code
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <aside className="space-y-10">
            <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
              <h3 className="text-lg font-black mb-10 flex items-center gap-3 text-gray-900 uppercase tracking-tight">
                <div className="p-2 bg-black rounded-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                Business Hours
              </h3>
              <div className="space-y-6">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                  const dayData = availability.find((d) => d.day === day);
                  const isEnabled = dayData?.enabled && dayData?.slots?.length > 0;
                  const slotCount = dayData?.slots?.length || 0;

                  return (
                    <div key={day} className="flex justify-between items-center text-sm group">
                      <span className="text-gray-500 font-bold group-hover:text-black transition-colors">{day}</span>
                      {isEnabled ? (
                        <span className="text-emerald-600 font-black text-[10px] tracking-widest uppercase bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg group-hover:bg-emerald-100 transition-all">
                          {slotCount} {slotCount === 1 ? 'Slot' : 'Slots'}
                        </span>
                      ) : (
                        <span className="text-zinc-400 font-black text-[10px] tracking-widest uppercase bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-lg group-hover:bg-zinc-100 group-hover:text-zinc-600 transition-all">
                          Closed
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <Link href="/teacher/callSchedule">
                <button className="w-full mt-10 py-4 bg-zinc-950 hover:bg-zinc-800 text-white border border-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-black/10">
                  Manage Availability
                </button>
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* Verification Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white border-2 border-black text-gray-900 rounded-[2rem] max-w-lg p-0 overflow-hidden">
          <div className="bg-black p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black flex items-center gap-4 uppercase tracking-tight">
                <BadgeCheck className="text-white w-8 h-8" />
                Request Certification
              </DialogTitle>
            </DialogHeader>
            <p className="mt-4 text-gray-400 text-sm font-medium leading-relaxed">
              Unlock professional verification status by providing credentials for human review.
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Document Source (PDF ONLY)</label>
              <div className="relative group">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="flex flex-col items-center justify-center gap-5 p-12 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:border-black hover:bg-gray-50 transition-all group"
                >
                  <div className="p-4 bg-gray-100 rounded-3xl group-hover:bg-black group-hover:text-white transition-all">
                    <Upload className="w-8 h-8 transition-colors" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-black text-gray-900 mb-1">
                      {file ? file.name : 'Select or drop credentials'}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      Max file size: 5MB
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button
                disabled={loading || !file}
                onClick={handleUpload}
                className="flex-[2] py-4 bg-black hover:bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-black/10 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Shield className="w-4 h-4" />}
                Submit Application
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
