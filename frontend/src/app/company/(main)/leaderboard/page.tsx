"use client";

import { useEffect, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import Header from "@/components/company/Header";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { useCompany } from "@/context/companyContext";
import { formatMinutesToHours } from "@/utils/timeConverter";
import { LeaderboardUser } from "@/types/company/companyTypes";

export default function CompanyLeaderboardPage() {
  const { company } = useCompany();

  const [topList, setTopList] = useState<LeaderboardUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<LeaderboardUser | null>(null);

  useEffect(() => {
    if (company?._id) fetchTop50();
  }, [company]);

  const fetchTop50 = async () => {
    const res = await companyApiMethods.getCompanyLeaderboard();
    setTopList(res.data.leaderboard);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return setSearchResult(null);

    const res = await companyApiMethods.searchLeaderboard({ name: searchTerm });
    setSearchResult(res.data || null);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/20 to-slate-900" />
      <div className="fixed inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="fixed w-px h-px bg-white/70 animate-pulse"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s` }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header />

        <div className="relative z-10 px-6 py-28 min-h-screen text-white">
          <div className="max-w-5xl mx-auto space-y-16">

            {/* Page Title */}
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold">
                Company Leaderboard
              </h1>
              <p className="text-gray-400 text-lg mt-3">
                Celebrate your top performers & drive competition
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex justify-center">
              <div className="flex w-full max-w-md gap-3">
                <input
                  type="text"
                  placeholder="Search employee..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/40 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-primary rounded-xl hover:bg-primary/80 transition"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Search Result */}
            {searchResult && (
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="text-2xl font-semibold">{searchResult.name}</div>
                <div className="text-gray-300 mt-1">
                  Rank: <span className="text-primary font-bold">#{searchResult.rank}</span>
                </div>
                <div className="mt-2 text-gray-400">
                  Hours: {formatMinutesToHours(searchResult.hours)} | Courses: {searchResult.courses} | Streak: {searchResult.streak}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            <section>
              <div className="
    rounded-2xl 
    bg-white/5 
    backdrop-blur-xl 
    border border-white/10 
    p-4 sm:p-8 lg:p-12
  ">
                {/* HEADER */}
                <h2 className="
      text-2xl sm:text-3xl lg:text-4xl 
      font-bold 
      text-center 
      mb-6 sm:mb-10 
      flex items-center justify-center gap-3
    ">
                  <Trophy className="h-7 w-7 sm:h-9 sm:w-9 text-primary" />
                  Top Performers
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  {topList.map((user: LeaderboardUser) => (
                    <div
                      key={user._id}
                      className="
            rounded-xl 
            bg-white/5 
            border border-white/10 
            hover:border-primary/40 
            transition-all duration-300
            p-4 sm:p-6
          "
                    >
                      {/* ROW */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">

                        {/* LEFT */}
                        <div className="flex items-center gap-4">
                          <div className="
                h-12 w-12 sm:h-14 sm:w-14
                rounded-full 
                flex items-center justify-center 
                text-white font-bold 
                text-lg sm:text-xl
                bg-gradient-to-br from-primary to-secondary 
                ring-4 ring-primary/20
              ">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>

                          <div>
                            <div className="text-base sm:text-lg font-semibold">
                              {user.name}
                            </div>

                            {user.isYou && (
                              <span className="
                    px-2 py-0.5 mt-1 inline-block 
                    bg-primary/20 text-primary 
                    text-xs rounded-lg
                  ">
                                You
                              </span>
                            )}
                          </div>
                        </div>

                        {/* RIGHT STATS */}
                        {/* RIGHT STATS — SINGLE LINE */}
                        <div
                          className="
    flex 
    items-center 
    justify-between 
    sm:justify-end 
    gap-6 sm:gap-10
    text-center sm:text-right
    whitespace-nowrap
  "
                        >

                          {/* HOURS */}
                          <div>
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                              {formatMinutesToHours(user.hours)}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400">
                              Hours
                            </div>
                          </div>

                          {/* STREAK */}
                          <div>
                            <div className="flex items-center justify-center sm:justify-end gap-1 text-orange-500">
                              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="text-lg sm:text-xl font-bold">
                                {user.streak}
                              </span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400">
                              Streak
                            </div>
                          </div>

                          {/* COURSES */}
                          <div>
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary">
                              {user.courses}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400">
                              Courses
                            </div>
                          </div>

                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div >
        </div >
      </div >
    </div >
  );
}
