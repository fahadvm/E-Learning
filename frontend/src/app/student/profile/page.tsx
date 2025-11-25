'use client';

import Link from 'next/link';
import Header from '@/components/student/header';
import { Mail, Phone, Linkedin, Instagram, Twitter, Edit2, User, Trophy, Target } from 'lucide-react';
import { useStudent } from '@/context/studentContext';
import { motion } from 'framer-motion';
import { studentProfileApi } from "@/services/APIservices/studentApiservice";
import React, { useEffect, useState } from "react";

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

const GITHUB_COLORS = {
  0: "bg-[#161b22]",
  1: "bg-[#0e4429]",
  2: "bg-[#006d32]",
  3: "bg-[#26a641]",
  4: "bg-[#39d353]",
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export default function StudentProfilePage() {
  const { student } = useStudent();

  // -------------------------------
  //    FETCH GITHUB + LEETCODE
  // -------------------------------

  const [contribData, setContribData] = useState<IContributionResponse | null>(null);
  const [loadingContrib, setLoadingContrib] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await studentProfileApi.getcontributions("fahad_fad", "fahadvm");
        if (!res.ok || !res.data) return;

        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        const eventsRes = await fetch(
          `https://api.github.com/users/fahadvm/events/public?per_page=100`
        );
        const events = await eventsRes.json();

        const todayEvents = Array.isArray(events)
          ? events.filter((e: any) => e.created_at.split("T")[0] === todayStr)
          : [];

        const todayCount = todayEvents.filter((e: any) => e.type === "PushEvent").length;

        const level =
          todayCount === 0 ? 0 : todayCount <= 2 ? 1 : todayCount <= 5 ? 2 : todayCount <= 10 ? 3 : 4;

        const todayContribution: IGithubContribution = {
          date: todayStr,
          count: todayCount,
          level,
        };

        const updatedGithub = res.data.github.filter((d: any) => d.date !== todayStr);
        updatedGithub.push(todayContribution);

        setContribData({ github: updatedGithub, leetcode: res.data.leetcode });
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingContrib(false);
      }
    }
    load();
  }, []);

  // ------------------------------------------------------------------------
  //                         LOADING STUDENT
  // ------------------------------------------------------------------------

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-900 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------------
  //                     PREPARE GITHUB HEATMAP DATA
  // ------------------------------------------------------------------------

  let weeks: (IGithubContribution | null)[][] = [];
  let totalContributions = 0;

  if (contribData && !loadingContrib) {
    const today = new Date();
    today.setDate(today.getDate() + 1);

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
    let currentDate = new Date(oneYearAgo);
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
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ---------------- LEFT SIDEBAR ---------------- */}
          <aside className="lg:col-span-4 space-y-8">

            {/* Profile */}
            <motion.div {...fadeIn} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8 text-center">
                <div className="relative inline-block mb-6">
                  <img
                    src={student.profilePicture || "/avatar.jpg"}
                    alt={student.name}
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <Link href="/student/profile/edit">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="absolute bottom-2 right-2 bg-indigo-900 text-white p-3 rounded-full shadow-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>

                <h2 className="text-2xl font-bold text-indigo-900">{student.name}</h2>
                <p className="text-gray-600 mt-1">{student.role}</p>

                <Link href="/student/profile/edit">
                  <button className="mt-8 w-full py-3.5 bg-indigo-900 text-white font-medium rounded-2xl">
                    Edit Profile
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div {...fadeIn} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-lg font-semibold text-indigo-900 mb-6 flex items-center gap-3">
                <Mail className="w-5 h-5" /> Contact
              </h3>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-700" />
                  </div>
                  <span className="text-gray-700 font-medium">{student.email}</span>
                </div>

                {student.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="text-gray-700 font-medium">{student.phone}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Social */}
            <motion.div {...fadeIn} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-lg font-semibold text-indigo-900 mb-6">Connect</h3>

              <div className="space-y-3">
                {student.social_links?.linkedin && (
                  <a href={student.social_links.linkedin} target="_blank" className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                    <Linkedin className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-700">LinkedIn</span>
                  </a>
                )}
                {student.social_links?.instagram && (
                  <a href={student.social_links.instagram} target="_blank" className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                    <Instagram className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-700">Instagram</span>
                  </a>
                )}
                {student.social_links?.twitter && (
                  <a href={student.social_links.twitter} target="_blank" className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                    <Twitter className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-700">Twitter / X</span>
                  </a>
                )}
              </div>
            </motion.div>
          </aside>

          {/* ---------------- MAIN CONTENT ---------------- */}
          <main className="lg:col-span-8 space-y-10">

            {/* About */}
            <motion.section {...fadeIn} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gray-100 rounded-2xl">
                  <User className="w-7 h-7 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-indigo-900">About</h3>
              </div>

              <p className="text-gray-700 text-lg">
                {student.about || "Building things with code. Learning every day."}
              </p>
            </motion.section>

            {/* Plan */}
            <motion.div {...fadeIn} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gray-100 rounded-2xl">
                  <Target className="w-7 h-7 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-indigo-900">Current Plan</h3>
              </div>

              <p className="text-xl font-semibold text-gray-800">
                {student.plans || "Free Plan"}
              </p>

              {student.plans && (
                <span className="inline-block mt-4 px-5 py-2 bg-indigo-900 text-white text-sm rounded-full">
                  Active
                </span>
              )}
            </motion.div>
            {/* ---------------- GITHUB CONTRIBUTIONS BLOCK ---------------- */}

            <motion.div {...fadeIn} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10">

              {loadingContrib ? (
                <div className="text-center py-10 text-gray-500">Loading GitHub...</div>
              ) : (
                <div className="text-black">
                  <h2 className="text-2xl font-bold mb-6 text-indigo-900">GitHub Contributions</h2>

                  <p className="text-3xl font-bold mb-6">
                    {totalContributions}
                    <span className="text-lg text-gray-500"> this year</span>
                  </p>

                  <div className="overflow-x-auto">
                    <div className="flex gap-3">
                      {weeks.map((week, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          {week.map((day, j) => (
                            <div
                              key={j}
                              className={`w-4 h-4 rounded ${
                                day ? GITHUB_COLORS[day.level] : "bg-gray-200"
                              }`}
                              title={day ? `${day.count} on ${day.date}` : "No activity"}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6 text-sm">
                    <span className="text-gray-600">Less</span>
                    {[0, 1, 2, 3, 4].map((l) => (
                      <div
                        key={l}
                        className={`w-4 h-4 rounded ${GITHUB_COLORS[l]}`}
                      />
                    ))}
                    <span className="text-gray-600">More</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* ---------------- LEETCODE BLOCK ---------------- */}
            <motion.div {...fadeIn} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10">

              {loadingContrib ? (
                <div className="text-center py-10 text-gray-500">Loading LeetCode...</div>
              ) : (
                <div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
                       className="h-10 opacity-80 mx-auto" />

                  <div className="text-6xl font-black text-center mt-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                    {computedTotalSolved}
                  </div>

                  <p className="text-center text-gray-600 mt-2 mb-10 text-lg">
                    Problems Solved
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 rounded-xl flex justify-between">
                      <span className="text-green-500 font-semibold">Easy</span>
                      <span className="text-3xl font-bold">{contribData?.leetcode.easySolved}</span>
                    </div>

                    <div className="p-4 bg-yellow-500/10 rounded-xl flex justify-between">
                      <span className="text-yellow-500 font-semibold">Medium</span>
                      <span className="text-3xl font-bold">{contribData?.leetcode.mediumSolved}</span>
                    </div>

                    <div className="p-4 bg-red-500/10 rounded-xl flex justify-between">
                      <span className="text-red-500 font-semibold">Hard</span>
                      <span className="text-3xl font-bold">{contribData?.leetcode.hardSolved}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>


          </main>
        </div>
      </div>
    </>
  );
}
