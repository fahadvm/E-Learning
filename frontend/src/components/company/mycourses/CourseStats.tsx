"use client"; 

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, Award, TrendingUp } from "lucide-react";

interface StatsProps {
  stats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalHoursLearned: number;
    certificatesEarned: number;
  };
}

export default function CourseStats({ stats }: StatsProps) {
  const statItems = [
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: <BookOpen className="h-6 w-6" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      label: "Completed",
      value: stats.completedCourses,
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      label: "In Progress",
      value: stats.inProgressCourses,
      icon: <Clock className="h-6 w-6" />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/20",
    },
    {
      label: "Hours Learned",
      value: stats.totalHoursLearned,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
    },
    {
      label: "Certificates",
      value: stats.certificatesEarned,
      icon: <Award className="h-6 w-6" />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map((item, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <CardContent className="p-6 text-center">
            <div
              className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}
            >
              <span className={item.color}>{item.icon}</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {item.value}
            </div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


