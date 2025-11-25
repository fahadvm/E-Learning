"use client";

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

export default function Contributions() {
  const [data, setData] = useState<IContributionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await studentProfileApi.getcontributions("fahad_fad", "fahadvm");
        if (!res.ok || !res.data) return;

        // TODAY'S CONTRIBUTIONS
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

        setData({ github: updatedGithub, leetcode: res.data.leetcode });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-[300px] bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading Contributions...</div>
      </div>
    );
  }

  const today = new Date();
  today.setDate(today.getDate() + 1);
  today.setHours(0, 0, 0, 0);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const validContributions = data.github
    .filter((d) => {
      const date = new Date(d.date);
      return date >= oneYearAgo && date <= today;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalContributions = validContributions.reduce((sum, d) => sum + d.count, 0);

  const weeks: (IGithubContribution | null)[][] = [];
  let currentWeek: (IGithubContribution | null)[] = [];
  let currentDate = new Date(oneYearAgo);
  let dataIndex = 0;

  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const contribution = validContributions[dataIndex];

    if (contribution && contribution.date === dateStr) {
      currentWeek.push(contribution);
      dataIndex++;
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

  // Month labels
  const monthLabels: { month: string; weekIndex: number; weekWidth: number }[] = [];
  weeks.forEach((week, i) => {
    const firstDay = week.find((d) => d !== null);
    if (!firstDay) return;

    const monthName = new Date(firstDay.date).toLocaleString("default", { month: "short" });

    const prev = monthLabels[monthLabels.length - 1];
    if (!prev || prev.month !== monthName) {
      monthLabels.push({ month: monthName, weekIndex: i, weekWidth: 1 });
    } else {
      prev.weekWidth += 1;
    }
  });

  const computedTotalSolved =
    data.leetcode.easySolved + data.leetcode.mediumSolved + data.leetcode.hardSolved;

  return (
    <div className="bg-black text-white px-6 py-12 rounded-xl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-4xl font-bold mb-12">Coding Activity</h1>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* GitHub */}
          <div className="lg:col-span-12">
            <div className="bg-[#0d1117] rounded-2xl p-8 border border-[#30363d]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">GitHub Contributions</h2>
                <span className="text-gray-400 text-sm">
                  {totalContributions} contributions this year
                </span>
              </div>

              <div className="overflow-x-auto">
                <div className="flex gap-6">
                  <div className="text-xs text-gray-500 space-y-2 mt-10">
                    <div></div>
                    <div>Mon</div>
                    <div></div>
                    <div>Wed</div>
                    <div></div>
                    <div>Fri</div>
                    <div></div>
                  </div>

                  <div>
                    <div className="flex text-xs text-gray-500 mb-3">
                      {monthLabels.map((m, i) => (
                        <div key={i} style={{ width: `${m.weekWidth * 16}px` }} className="text-center">
                          {m.month}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-1">
                      {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-1">
                          {week.map((day, di) => {
                            const level = day?.level ?? 0;
                            return (
                              <div
                                key={di}
                                className={`w-3 h-3 rounded-sm ${GITHUB_COLORS[level]} cursor-help`}
                                title={
                                  day
                                    ? `${day.count} contributions on ${day.date}`
                                    : "No contributions"
                                }
                              ></div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-8 text-xs text-gray-500">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((l) => (
                    <div key={l} className={`w-3 h-3 rounded-sm ${GITHUB_COLORS[l]}`}></div>
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </div>

          {/* LeetCode */}
          <div className="lg:col-span-12">
            <div className="bg-[#0d1117] rounded-2xl p-8 border border-[#30363d]">
              <div className="flex items-center justify-between mb-8">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
                  className="h-9 opacity-90"
                />
                <span className="text-xs text-gray-500">LeetCode Stats</span>
              </div>

              <div className="text-center mb-10">
                <div className="text-8xl font-bold">{computedTotalSolved}</div>
                <p className="text-gray-400 mt-3 text-lg">Solved Problems</p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Easy</span>
                  <span className="text-4xl font-bold text-green-400">
                    {data.leetcode.easySolved}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Medium</span>
                  <span className="text-4xl font-bold text-yellow-400">
                    {data.leetcode.mediumSolved}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hard</span>
                  <span className="text-4xl font-bold text-red-400">
                    {data.leetcode.hardSolved}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  