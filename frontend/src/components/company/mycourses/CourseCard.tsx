"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { formatMinutesToHours } from "@/utils/timeConverter";

interface BackendCourse {
  _id: string;
  title: string;
  subtitle?: string;
  category: string;
  coverImage: string;
  totalDuration: number;
  level: string;
  status: "published" | "draft" | "blocked";
  isBlocked: boolean;
  language: string;
  modules: any[];
}

interface CourseCardProps {
  course: BackendCourse;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const router = useRouter();

  const handleDetails = () => {
    router.push(`/company/mycourses/${course._id}`);
  };

  const getStatusColor = () => {
    if (course.status === "published") return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    if (course.isBlocked) return "bg-red-500/20 text-red-700 border-red-500/30";
    return "bg-gray-500/20 text-gray-700 border-gray-500/30";
  };

  const getStatusText = () => {
    if (course.status === "published") return "Published";
    if (course.isBlocked) return "Blocked";
    return "Draft";
  };

  return (
    <Card className="group hover:shadow-hover hover:scale-105 transition-all duration-300 hover:border-primary/40 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        <div className="absolute top-4 left-4">
          <Badge className={`${getStatusColor()} backdrop-blur-sm`}>
            {getStatusText()}
          </Badge>
        </div>

        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="backdrop-blur-sm">
            {course.level}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg text-foreground leading-tight">
          {course.title}
        </h3>
        {course.subtitle && (
          <p className="text-sm text-muted-foreground">{course.subtitle}</p>
        )}
        <div className="flex gap-3 mt-2">
          <Badge variant="outline">{course.category}</Badge>
          <Badge variant="outline">{course.language}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{course.modules.length} modules</span>
          <span>{formatMinutesToHours(course.totalDuration)} hours</span>
        </div>

        <Button className="w-full" onClick={handleDetails}>
          View Course
        </Button>
      </CardContent>
    </Card>
  );
};
