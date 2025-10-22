"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react"
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Settings,
  Maximize,
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  completed?: boolean;
  videoFile?: string;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  category: string;
  coverImage?: string;
  totalDuration: number;
  teacherId?: {
    _id: string;
    name: string;
    email: string;
    about: string;
    profilePicture: string;
  };
  totalStudents?: number;
  reviews?: { rating: number }[];
  createdAt?: string;
  description?: string;
  modules?: Module[];
  progress?: number;
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const courseId = params?.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await employeeApiMethods.getMyCourseDetails(courseId);
      if (res.ok) {
        const courseData = res.data;
        setCourse(courseData);
        const firstModule = courseData.modules?.[0];
        const firstLesson = firstModule?.lessons?.[0] || null;
        setCurrentLesson(firstLesson);
        console.log("Course data:", courseData);
      } else {
        console.error("Failed to fetch course details:", res.message);
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (reviews?: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return "No rating";
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  };

  const completedLessons = course?.modules?.flatMap((module) => module.lessons).filter((lesson) => lesson.completed).length || 0;
  const totalLessons = course?.modules?.flatMap((module) => module.lessons).length || 0;
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Course not found</h2>
          <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
          <Link href="/employee/mycourses">
            <Button>Back to My Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/employee/mycourses">
              <Button variant="ghost" size="sm" className="hover:bg-muted">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Courses
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{course.category}</Badge>
              <div className="text-sm text-muted-foreground">
                {completedLessons}/{totalLessons} lessons completed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="relative bg-black rounded-t-lg overflow-hidden">
                  {currentLesson?.videoFile ? (
                    <video
                      className="w-full aspect-video"
                      controls
                      src={currentLesson.videoFile}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                        <p className="text-lg font-medium">{currentLesson?.title || "Select a lesson to start"}</p>
                        <p className="text-sm opacity-80">
                          {currentLesson?.videoFile ? `Duration: ${currentLesson.duration} minutes` : "No video available"}
                        </p>

                      </div>
                    </div>
                  )}

                  {/* Video Controls */}
                  {currentLesson?.videoFile && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      {/* <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                            <SkipBack className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                            <SkipForward className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                            <Maximize className="w-4 h-4" />
                          </Button>
                        </div>
                      </div> */}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Course Details Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Course Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">
                          {Math.round(course.totalDuration / 60)}h {course.totalDuration % 60}m
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Students</p>
                        <p className="font-medium">{course.totalStudents?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <p className="font-medium flex items-center">
                          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {calculateAverageRating(course.reviews)}
                        </p>
                      </div>
                     <div>
  <p className="text-muted-foreground">Instructor</p>
  <div className="flex items-center gap-2">
    <Link
      href={`/teacher/${course.teacherId?._id}`}
      className="font-medium text-blue-600 hover:underline"
    >
      {course.teacherId?.name || "Unknown Instructor"}
    </Link>

    {course.teacherId && (
      <Link href={`/messages/${course.teacherId._id}`} title="Message Teacher">
        <MessageSquare className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer align-middle" />
      </Link>
    )}
  </div>
</div>

                    </div>
                  </CardContent>
                </Card>
              </TabsContent>


              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle>My Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">No notes yet. Start taking notes as you watch the lessons!</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Download className="w-5 h-5 mr-2" />
                      Course Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">Course Materials.pdf</p>
                          <p className="text-sm text-muted-foreground">2.4 MB</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">Source Code.zip</p>
                          <p className="text-sm text-muted-foreground">15.7 MB</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Course Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {completedLessons} of {totalLessons} lessons completed
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lessons List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {course.modules?.map((module, moduleIndex) => (
                    <div key={module.title} className="border-b border-border last:border-b-0">
                      <div className="p-4 bg-muted/50 font-medium text-sm">
                        Module {moduleIndex + 1}: {module.title}
                      </div>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center p-4 cursor-pointer hover:bg-muted transition-colors ${currentLesson?.id === lesson.id ? "bg-muted border-r-2 border-primary" : ""
                            }`}
                          onClick={() => setCurrentLesson(lesson)}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="flex-shrink-0">
                              {lesson.completed ? (
                                <CheckCircle className="w-5 h-5 text-primary" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${lesson.completed ? "text-foreground" : "text-muted-foreground"
                                  }`}
                              >
                                {moduleIndex + 1}.{lessonIndex + 1}. {lesson.title}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="w-3 h-3 mr-1" />
                                {lesson.duration} min
                              </div>
                            </div>
                          </div>
                          {currentLesson?.id === lesson.id && <Play className="w-4 h-4 text-primary" />}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}