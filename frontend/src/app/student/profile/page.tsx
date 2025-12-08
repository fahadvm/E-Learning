'use client';

import { Mail, Phone, Linkedin, Edit2, User, Target, Github, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from "react";
import Header from '@/components/student/header';
import Link from "next/link";  // ✅ FIXED
import { studentProfileApi } from '@/services/APIservices/studentApiservice';

interface IGithubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ILeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

interface IContributionResponse {
  github: IGithubContribution[];
  leetcode: ILeetCodeStats;
}

interface IStudentProfile {
  _id: string;
  name: string;
  role?: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  about?: string;
  planName?: string;
  planStatus?: "active" | "expired" | "none";
  social_links?: {
    linkedin?: string;
    gitHub?: string;
    leetCode?: string;
  };
}

const GITHUB_COLORS = {
  0: "bg-gray-100",
  1: "bg-emerald-200",
  2: "bg-emerald-400",
  3: "bg-emerald-600",
  4: "bg-emerald-800",
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export default function StudentProfilePage() {

  const [contribData, setContribData] = useState<IContributionResponse | null>(null);
  const [student, setStudent] = useState<IStudentProfile | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingContrib, setLoadingContrib] = useState(true);

  const fetchStudent = async () => {
    try {
      const response = await studentProfileApi.getProfile();
      setStudent(response.data);
    } catch (err) {
      console.error("Failed to load student profile", err);
    } finally {
      setLoadingStudent(false);
    }
  };

  const fetchContributions = async () => {
    if (!student?.social_links) {
      setContribData({
        github: [],
        leetcode: { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 }
      });
      setLoadingContrib(false);
      return;
    }

    setLoadingContrib(true); // ← Important

    try {
      const leetCodeUsername = student.social_links.leetCode
        ? student.social_links.leetCode
          .trim()
          .replace(/\/+$/, '')
          .split('/')
          .pop()
          ?.replace(/^u\//, '') || null
        : null;

      const gitHubUsername = student.social_links.gitHub
        ? student.social_links.gitHub
          .trim()
          .replace(/\/+$/, '')
          .split('/')
          .pop() || null
        : null;

      if (!leetCodeUsername && !gitHubUsername) {
        setContribData({
          github: [],
          leetcode: { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 }
        });
        return; // finally will set loading to false
      }

      const response = await studentProfileApi.getContributions(
        leetCodeUsername ?? '',
        gitHubUsername ?? ''
      );

      setContribData(response.data);
    } catch (err) {
      console.error("Failed to load contribution stats", err);
    } finally {
      setLoadingContrib(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  useEffect(() => {
    if (student) {
      fetchContributions();
    }
  }, [student]);

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // GitHub Heatmap
  const weeks: (IGithubContribution | null)[][] = [];
  let totalContributions = 0;

  if (contribData && !loadingContrib) {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const validContributions = contribData.github
      .filter((d) => {
        const date = new Date(d.date);
        return date >= oneYearAgo && date <= today;
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    totalContributions = validContributions.reduce((s, d) => s + d.count, 0);

    let currentWeek: (IGithubContribution | null)[] = [];
    const currentDate = new Date(oneYearAgo);
    let i = 0;

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const match = validContributions[i];

      if (match && match.date === dateStr) {
        currentWeek.push(match);
        i++;
      } else {
        currentWeek.push(null);
      }

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }
  }

  const computedTotalSolved =
    (contribData?.leetcode.easySolved || 0) +
    (contribData?.leetcode.mediumSolved || 0) +
    (contribData?.leetcode.hardSolved || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-1 space-y-6">

            {/* Profile Card */}
            <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8">
                {/* Profile Image + Edit Icon */}
                <div className="relative w-32 h-32 mx-auto">
                  <div className="w-full h-full rounded-full bg-indigo-900 p-1">
                    <img
                      src={student.profilePicture || "/avatar.jpg"}
                      alt={student.name}
                      className="w-full h-full rounded-full object-cover bg-white"
                    />
                  </div>

                  <button
                    className="absolute bottom-1 right-1 bg-indigo-900 text-white p-2.5 rounded-full shadow-md hover:bg-indigo-700 transition-colors"
                    aria-label="Edit profile picture"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Name + Role */}
                <div className="text-center mt-6">
                  <h2 className="text-2xl font-semibold text-gray-900">{student.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{student.role}</p>
                </div>

                {/* Edit Profile Button */}
                <div className="mt-5 flex justify-center">
                  <Link href="/student/profile/edit">
                    <button className="px-6 py-2 text-sm bg-indigo-900 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors">
                      Edit Profile
                    </button>
                  </Link>
                </div>
              </div>

            </motion.div>

            {/* Contact Card */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-sm break-all">{student.email}</span>
                </div>

                {student.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{student.phone}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Social Links */}
            {/* Social Links - IMPROVED */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>

              <div className="space-y-4">
                {/* LinkedIn */}
                {student.social_links?.linkedin ? (
                  <a
                    href={student.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    <div>
                      <span className="text-gray-700 text-sm font-medium">LinkedIn</span>
                      <p className="text-xs text-gray-500">linkedin.com/in/...</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                    <Linkedin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-500 text-sm">You haven't added your LinkedIn yet</span>
                  </div>
                )}

                {/* GitHub - Extract username from URL */}
                {student.social_links?.gitHub ? (
                  (() => {
                    const githubUrl = student.social_links!.gitHub!;
                    const githubUsername = githubUrl.trim().replace(/\/+$/, '').split('/').pop() || 'Unknown';
                    return (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <Github className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />
                        <div>
                          <span className="text-gray-700 text-sm font-medium">GitHub</span>
                          <p className="text-xs text-gray-500">@{githubUsername}</p>
                        </div>
                      </a>
                    );
                  })()
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                    <Github className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-500 text-sm">You haven't added your GitHub yet</span>
                  </div>
                )}

                {/* LeetCode - Extract username from URL */}
                {student.social_links?.leetCode ? (
                  (() => {
                    const leetCodeUrl = student.social_links!.leetCode!;
                    const leetCodeUsername = leetCodeUrl
                      .trim()
                      .replace(/\/+$/, '')
                      .split('/')
                      .pop()
                      ?.replace(/^u\//, '') || 'Unknown'; // Handles both /u/username and direct username format

                    return (
                      <a
                        href={leetCodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <Code2 className="w-5 h-5 text-gray-600 group-hover:text-amber-600 transition-colors" />
                        <div>
                          <span className="text-gray-700 text-sm font-medium">LeetCode</span>
                          <p className="text-xs text-gray-500">@{leetCodeUsername}</p>
                        </div>
                      </a>
                    );
                  })()
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/50">
                    <Code2 className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-500 text-sm">You haven't added your LeetCode yet</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Current Plan — FIXED FIELD */}
            <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="rounded-2xl shadow-sm p-6 text-black bg-white border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Current Plan</h3>
              </div>

              <p className="text-2xl font-bold mb-2">{student.planName || "Free Plan"}</p>

              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                {student.planStatus || "active"}
              </span>
            </motion.div>

          </aside>

          {/* ========================== MAIN CONTENT ========================== */}

          <main className="lg:col-span-2 space-y-6">

            {/* About */}
            <motion.section {...fadeIn} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">About</h3>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {student.about || "Building things with code. Learning every day."}
              </p>
            </motion.section>

            {/* GitHub Contributions */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
              {loadingContrib ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading contributions...</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gray-900 rounded-lg">
                      <Github className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">GitHub Contributions</h3>
                  </div>

                  <div className="mb-6">
                    <p className="text-4xl font-bold text-gray-900">{totalContributions}</p>
                    <p className="text-gray-600 text-sm mt-1">contributions this year</p>
                  </div>

                  <div className="overflow-x-auto pb-4">
                    <div className="inline-flex gap-1">
                      {weeks.map((week, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          {week.map((day, j) => (
                            <div
                              key={j}
                              className={`w-3 h-3 rounded-sm ${day ? GITHUB_COLORS[day.level] : "bg-gray-100"}`}
                              title={day ? `${day.count} contributions on ${day.date}` : "No activity"}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((l) => (
                      <div key={l} className={`w-3 h-3 rounded-sm ${GITHUB_COLORS[l]}`} />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* LeetCode Stats */}
            <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
              {loadingContrib ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading LeetCode stats...</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Code2 className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">LeetCode Stats</h3>
                  </div>

                  <div className="text-center mb-8">
                    <div className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      {computedTotalSolved}
                    </div>
                    <p className="text-gray-600 mt-2">Problems Solved</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-700 font-semibold text-sm">Easy</span>
                        <span className="text-2xl font-bold text-emerald-900">
                          {contribData?.leetcode.easySolved}
                        </span>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <div className="flex justify-between items-center">
                        <span className="text-amber-700 font-semibold text-sm">Medium</span>
                        <span className="text-2xl font-bold text-amber-900">
                          {contribData?.leetcode.mediumSolved}
                        </span>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                      <div className="flex justify-between items-center">
                        <span className="text-red-700 font-semibold text-sm">Hard</span>
                        <span className="text-2xl font-bold text-red-900">
                          {contribData?.leetcode.hardSolved}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </motion.div>

          </main>

        </div>
      </div>
    </div>
  );
}
