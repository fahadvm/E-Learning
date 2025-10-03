import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, CheckCircle, Clock, Star, Award, BookOpen } from "lucide-react";

interface BackendCourse {
  _id: string;
  title: string;
  subtitle?: string;
  teacherId: string;
  instructor?: string; // optional, can fetch teacher name separately
  category: string;
  coverImage: string;
  duration: number; // in hours or weeks
  totalDuration?: number;
  level: string;
  status: "published" | "draft" | "blocked";
  isPublished: boolean;
  isBlocked: boolean;
  isVerified: boolean;
  language: string;
  learningOutcomes: string[];
  modules: any[];
  price: number;
  requirements: string[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}


interface CourseCardProps {
  course: BackendCourse;
}

export const CourseCard = ({ course }: CourseCardProps) => {
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
        {course.subtitle && <p className="text-sm text-muted-foreground">{course.subtitle}</p>}
        <Badge variant="outline" className="w-fit">
          {course.category}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{course.modules.length} modules</span>
          <span>{course.duration} hours</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Learning Outcomes:</p>
          <ul className="text-sm text-foreground list-disc list-inside">
            {course.learningOutcomes.map((lo, idx) => (
              <li key={idx}>{lo}</li>
            ))}
          </ul>
        </div>
        <Button variant="default" className="w-full">
          Start Course
        </Button>
      </CardContent>
    </Card>
  );
};
