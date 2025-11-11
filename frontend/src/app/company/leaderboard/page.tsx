"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Crown } from "lucide-react";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { useCompany } from "@/context/companyContext";

export default function CompanyLeaderboardPage() {
  const { company } = useCompany();

  const [topList, setTopList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);

  useEffect(() => {
    if (company?._id) fetchTop50();
  }, [company]);

  const fetchTop50 = async () => {
    const res = await companyApiMethods.getCompanyLeaderboard();
    setTopList(res.data.leaderboard);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return setSearchResult(null);

    const res = await companyApiMethods.searchLeaderboard({name:searchTerm});
    setSearchResult(res.data || null);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500 w-7 h-7" />;
    if (rank === 2) return <span className="text-xl font-semibold text-gray-500">#2</span>;
    if (rank === 3) return <span className="text-xl font-semibold text-orange-500">#3</span>;
    return <span className="text-lg font-semibold text-gray-700">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-900">Company Leaderboard</h1>
          <p className="text-gray-600 text-lg mt-2">Top Performers Across Your Organization</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 justify-end">
          <input
            type="text"
            placeholder="Search employee..."
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 w-full md:w-72 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Search
          </button>
        </div>

        {/* Search Result Card (If user not in top 50) */}
        {searchResult && (
          <Card className="p-6 border border-emerald-300 shadow-md bg-white/70">
            <p className="text-gray-800 text-lg font-semibold">{searchResult.name}</p>
            <p className="text-gray-500">Rank: <span className="font-bold text-emerald-600">#{searchResult.rank}</span></p>
            <p className="text-gray-500">Hours: {searchResult.hours}h | Courses: {searchResult.courses} | Streak: {searchResult.streak}</p>
          </Card>
        )}

        {/* Top 50 Leaderboard */}
        <Card className="shadow-xl overflow-hidden border-0 bg-white/70 backdrop-blur-md">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800">
                <th className="px-6 py-4 text-left font-bold">Rank</th>
                <th className="px-6 py-4 text-left font-bold">Employee</th>
                <th className="px-6 py-4 text-right font-bold">Hours</th>
                <th className="px-6 py-4 text-right font-bold">Streak</th>
                <th className="px-6 py-4 text-right font-bold">Courses</th>
              </tr>
            </thead>

            <tbody>
              {topList.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{getRankIcon(user.rank)}</td>

                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                      {(user.name).slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      {user.isYou && (
                        <Badge className="bg-emerald-600 text-white">You</Badge>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-emerald-700">{user.hours}</td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="font-bold text-orange-600">{user.streak}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-teal-700">{user.courses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

      </div>
    </div>
  );
}
