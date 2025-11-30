"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function AchievementsPage() {
  /* -------------------------------------------------------
        MOCK DATA (Replace with API later)
  -------------------------------------------------------- */
  const mockAchievements = [
    {
      id: "1",
      title: "Completed 10 Courses",
      date: "2025-01-20",
      icon: <Trophy className="text-yellow-500" size={32} />,
    },
    {
      id: "2",
      title: "Daily Streak 5 Days",
      date: "2025-01-18",
      icon: <Zap className="text-orange-500" size={32} />,
    },
    {
      id: "3",
      title: "Top Rank in Class",
      date: "2025-01-15",
      icon: <Star className="text-blue-500" size={32} />,
    },
    {
      id: "4",
      title: "Hit 500 Learning Points",
      date: "2025-01-10",
      icon: <Target className="text-green-500" size={32} />,
    },
  ];

  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState(mockAchievements);

  useEffect(() => {
    // simulate load
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  /* -------------------------------------------------------
        LOADING (Skeletons)
  -------------------------------------------------------- */
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"
            ></div>
          ))}
        </div>

        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
        PAGE CONTENT WITH MOCK DATA
  -------------------------------------------------------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Achievements
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track your progress and milestones.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Badges"
          value="12"
          colors="from-yellow-400 to-orange-500"
          Icon={Trophy}
        />
        <StatCard
          title="Global Rank"
          value="Top 5%"
          colors="from-blue-400 to-indigo-500"
          Icon={Star}
        />
        <StatCard
          title="Points Earned"
          value="850"
          colors="from-green-400 to-emerald-500"
          Icon={Target}
        />
        <StatCard
          title="Current Streak"
          value="7 Days"
          colors="from-purple-400 to-pink-500"
          Icon={Zap}
        />
      </div>

      {/* Recent Badges */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Recent Badges
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
          >
            <div className="text-4xl mb-3">{achievement.icon}</div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
              {achievement.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Earned {achievement.date}
            </p>
          </motion.div>
        ))}

        {/* Locked Items */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={`locked-${i}`}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex flex-col items-center text-center border border-dashed border-gray-300 dark:border-gray-700 opacity-60"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mb-3 flex items-center justify-center">
              <span className="text-gray-400 text-xl">?</span>
            </div>
            <h4 className="font-medium text-gray-400 text-sm mb-1">Locked</h4>
            <p className="text-xs text-gray-400">Keep learning</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------
    REUSABLE STAT CARD COMPONENT
-------------------------------------------------------- */
function StatCard({
  title,
  value,
  colors,
  Icon,
}: {
  title: string;
  value: string;
  colors: string;
  Icon: any;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${colors} rounded-2xl p-6 text-white shadow-lg`}
    >
      <Icon size={32} className="mb-4 opacity-80" />
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-white/80 font-medium">{title}</p>
    </div>
  );
}
