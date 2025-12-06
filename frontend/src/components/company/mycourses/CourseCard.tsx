"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { formatMinutesToHours } from "@/utils/timeConverter";

interface CompanyCourse {
  _id: string;
  title: string;
  subtitle?: string;
  category: string;
  coverImage?: string;
  totalDuration?: number;
  language?: string;
  modules?: any[];
  // extras from purchase
  seats?: number;
  accessType?: string;
  price?: number;
}

interface CourseCardProps {
  course: CompanyCourse;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const router = useRouter();

  const handleDetails = () => {
    router.push(`/company/mycourses/${course._id}`);
  };

  const image = course.coverImage || "/images/course-placeholder.jpg"; // fallback image
  const totalModules = course.modules?.length || 0;
  const hours = course.totalDuration
    ? formatMinutesToHours(course.totalDuration)
    : "0";

  return (
    <Card className="group hover:shadow-hover hover:scale-105 transition-all duration-300 hover:border-primary/40 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="backdrop-blur-sm bg-primary/20 text-primary border-primary/30">
            {course.category}
          </Badge>
        </div>

        {/* Language */}
        {course.language && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="backdrop-blur-sm">
              {course.language}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg text-foreground leading-tight">
          {course.title}
        </h3>

        {course.subtitle && (
          <p className="text-sm text-muted-foreground">{course.subtitle}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Modules & Duration */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{totalModules} modules</span>
          <span>{hours} hours</span>
        </div>

        {/* Seats & Price */}
        <div className="flex justify-between text-sm font-medium">
          {course.seats && (
            <span className="text-primary">{course.seats} Seats</span>
          )}
          {course.price && (
            <span className="text-green-600">₹{course.price}</span>
          )}
        </div>

        {/* Button */}
        <Button className="w-full" onClick={handleDetails}>
          View Course
        </Button>
      </CardContent>
    </Card>
  );
};
