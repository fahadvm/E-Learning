'use client';

import React, { useEffect, useState } from 'react';
import { useEmployee } from '@/context/employeeContext';
import { useRouter } from "next/navigation";
import {
  ChevronRight, Award, TrendingUp, Users, Star, ArrowRight,
  BarChart3, Trophy, Building2,
  BookOpen, Rocket
} from 'lucide-react';
import { formatMinutesToHours } from '@/utils/timeConverter';
import { employeeApiMethods } from '@/services/APIservices/employeeApiService';
import type { LeaderboardUser } from '@/types/employee/leaderboard';

export default function EmployeeHome() {
  const { employee } = useEmployee();
  const router = useRouter();

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const companyId = typeof employee?.companyId === 'object'
        ? (employee.companyId as { _id: string })._id
        : employee?.companyId;

      if (companyId) {
        try {
          const res = await employeeApiMethods.getAllTimeLeaderBoard({ companyId });
          if (res?.ok && res.data) {
            setLeaderboard(res.data.leaderboard.slice(0, 3));
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [employee]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://www.shutterstock.com/image-photo/defocused-background-modern-open-office-600nw-2570629407.jpg')",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto text-center text-white">
          {/* Avatar */}
          <img
            src="https://media.istockphoto.com/id/2156807988/vector/simple-gray-avatar-icons-representing-male-and-female-profiles-vector-minimalist-design-with.jpg?s=612x612&w=0&k=20&c=xi7g5_9VBSWgntTZ-OQNS74d0oOvUnDGxjxUL_LdJUM="
            alt="Employee Avatar"
            className="w-32 h-32 rounded-full mx-auto mb-8 border-4 border-white shadow-xl"
          />

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Unlock Your
            <br />
            <span className="bg-blue-500 bg-clip-text text-transparent">
              Full Potential
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
            Transform your career with personalized learning paths, expert courses,
            and a community that celebrates your growth
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/employee/courses')}
              className="group px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold text-lg shadow-xl hover:scale-105 transition"
            >
              Start Learning
            </button>

            <button
              onClick={() => router.push('/employee/learningpath')}
              className="px-8 py-4 bg-white/90 text-gray-900 rounded-xl font-semibold text-lg shadow-xl hover:scale-105 transition"
            >
              View Learning Paths
            </button>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform designed to accelerate your professional growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Expert Courses",
                description: "Learn from industry professionals with hands-on projects and real-world applications",
                gradient: "from-blue-900 to-cyan-500"
              },
              {
                icon: Trophy,
                title: "Earn Certificates",
                description: "Showcase your achievements with verified certificates recognized by top companies",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Users,
                title: "Team Learning",
                description: "Collaborate with colleagues and compete on leaderboards to stay motivated",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: BarChart3,
                title: "Track Progress",
                description: "Monitor your learning journey with detailed analytics and personalized insights",
                gradient: "from-green-500 to-emerald-500"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <Trophy className="w-10 h-10 text-yellow-500" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Top Performers
              </h2>
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {employee?.companyId
                ? 'Celebrating the stars of your organization. Keep learning to join them!'
                : 'Join a company to unlock the leaderboard and compete with your peers'}
            </p>
          </div>

          {employee?.companyId ? (
            leaderboard.length > 0 ? (
              <div className="space-y-8">
                {/* Podium */}
                <div className="flex flex-col md:flex-row items-end justify-center gap-8">
                  {/* 2nd Place */}
                  {leaderboard[1] && (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 p-1 shadow-xl">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {leaderboard[1].avatar ? (
                              <img src={leaderboard[1].avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-3xl font-bold text-gray-400">{leaderboard[1].name.slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          2
                        </div>
                      </div>
                      <h4 className="mt-4 text-xl font-bold text-gray-900">{leaderboard[1].name}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Award className="w-4 h-4" /> 2nd Place
                      </p>
                      <p className="mt-2 text-lg font-semibold text-gray-700">{formatMinutesToHours(leaderboard[1].hours)}</p>
                    </div>
                  )}

                  {/* 1st Place */}
                  {leaderboard[0] && (
                    <div className="flex flex-col items-center md:-translate-y-8">
                      <div className="relative">
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1.5 shadow-2xl">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {leaderboard[0].avatar ? (
                              <img src={leaderboard[0].avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-4xl font-black text-yellow-500">{leaderboard[0].name.slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                        </div>
                        <div className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h4 className="mt-6 text-2xl font-black text-gray-900">{leaderboard[0].name}</h4>
                      <p className="text-base font-bold text-yellow-600 flex items-center gap-2 mt-2">
                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" /> Champion
                      </p>
                      <p className="mt-3 text-2xl font-bold text-yellow-600">{formatMinutesToHours(leaderboard[0].hours)}</p>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {leaderboard[2] && (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-amber-700 p-1 shadow-xl">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {leaderboard[2].avatar ? (
                              <img src={leaderboard[2].avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-3xl font-bold text-orange-500">{leaderboard[2].name.slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          3
                        </div>
                      </div>
                      <h4 className="mt-4 text-xl font-bold text-gray-900">{leaderboard[2].name}</h4>
                      <p className="text-sm text-orange-600 flex items-center gap-1 mt-1">
                        <Award className="w-4 h-4" /> 3rd Place
                      </p>
                      <p className="mt-2 text-lg font-semibold text-orange-700">{formatMinutesToHours(leaderboard[2].hours)}</p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => router.push('/employee/leaderboard')}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    View Full Leaderboard
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
                <TrendingUp className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Competition Starting Soon</h3>
                <p className="text-gray-600">Start learning to lead the leaderboard!</p>
              </div>
            )
          ) : (
            <div className="text-center bg-white p-16 rounded-3xl shadow-xl">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-8">
                <Users className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Unlock Your Company Ranking</h3>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Connect with your organization to compete with peers and accelerate your growth
              </p>
              <button
                onClick={() => router.push('/employee/company')}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <Building2 className="w-6 h-6" />
                Join Your Organization
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-blue-500 rounded-3xl p-16 text-center shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Level Up Your Career?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of professionals transforming their skills with our platform
              </p>
              <button
                onClick={() => router.push('/employee/courses')}
                className="inline-flex items-center gap-3 px-12 py-5 bg-white text-gray-900 rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <Rocket className="w-7 h-7" />
                Start Your Journey
                <ArrowRight className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Spacing */}
      <div className="h-20" />

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
