"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Clock,
  Star,
  Download,
  BookOpen,
  CheckCircle,
  MessageSquare,
  Code2,
  Clock2,
  Send,
  Trash2,
  UserRound,
  VideoIcon

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { studentCourseApi } from "@/services/APImethods/studentAPImethods";

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
  description?: string;
  modules?: Module[];
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const courseId = params?.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<string>(() => localStorage.getItem(`notes_${courseId}`) || "");
  const [comments, setComments] = useState<string[]>(() => JSON.parse(localStorage.getItem(`comments_${courseId}`) || "[]"));
  const [newComment, setNewComment] = useState("");
  const [code, setCode] = useState("// Try some code here!");
  const [output, setOutput] = useState("");

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await studentCourseApi.getMyCourseDetails(courseId);
      if (res.ok) {
        const courseData = res.data;
        console.log("course details:", courseData)
        setCourse(courseData);
        const firstLesson = courseData.modules?.[0]?.lessons?.[0] || null;
        setCurrentLesson(firstLesson);
      } else {
        console.error("Failed to fetch course:", res.message);
      }
    } catch (err) {
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (reviews?: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return "No rating";
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  };

  const completedLessonsCount =
    course?.modules?.flatMap((m) => m.lessons).filter((l) => l.completed).length || 0;
  const totalLessonsCount =
    course?.modules?.flatMap((m) => m.lessons).length || 0;
  const progress = totalLessonsCount > 0 ? (completedLessonsCount / totalLessonsCount) * 100 : 0;

  const markLessonComplete = async (moduleIndex: number, lessonIndex: number) => {
    if (!course) return;
    const lesson = course.modules![moduleIndex].lessons[lessonIndex];
    if (lesson.completed) return;

    try {
      const res = await studentCourseApi.markLessonComplete(course._id, moduleIndex, lessonIndex);
      if (res.ok) {
        setCourse((prev) => {
          if (!prev) return prev;
          const updatedModules = prev.modules?.map((mod, mIdx) => {
            if (mIdx !== moduleIndex) return mod;
            const updatedLessons = mod.lessons.map((les, lIdx) => {
              if (lIdx !== lessonIndex) return les;
              return { ...les, completed: true };
            });
            return { ...mod, lessons: updatedLessons };
          });
          return { ...prev, modules: updatedModules };
        });
        setCurrentLesson((prev) => prev && { ...prev, completed: true });
      }
    } catch (err) {
      console.error("Error marking lesson complete:", err);
    }
  };

  const handleNotesSave = () => {
    localStorage.setItem(`notes_${courseId}`, notes);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(`comments_${courseId}`, JSON.stringify(updated));
    setNewComment("");
  };

  const handleRunCode = async () => {
    try {
      const res = await fetch("https://api.jdoodle.com/v1/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: "YOUR_JDOODLE_CLIENT_ID",
          clientSecret: "YOUR_JDOODLE_CLIENT_SECRET",
          script: code,
          language: "nodejs",
          versionIndex: "4"
        }),
      });
      const data = await res.json();
      setOutput(data.output || "No output");
    } catch (error) {
      setOutput("Error running code.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading course...
      </div>
    );

  if (!course)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Course not found
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/student/mycourses">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">{course.category}</Badge>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left: Video + Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {currentLesson?.videoFile ? (
                <video
                  className="w-full aspect-video"
                  controls
                  src={currentLesson.videoFile}
                  onEnded={() => {
                    const m = course.modules!.findIndex((x) =>
                      x.lessons.includes(currentLesson)
                    );
                    const l = course.modules![m].lessons.findIndex(
                      (x) => x.id === currentLesson.id
                    );
                    markLessonComplete(m, l);
                  }}
                />
              ) : (
                <div className="aspect-video bg-muted flex justify-center items-center text-muted-foreground">
                  Select a lesson to start
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="compiler">Compiler</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 ">
                    <UserRound className="w-5 h-5 " />
                    About Instructor
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-4">
                    {/* Instructor Profile Picture */}
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300 shadow-sm">
                      <img
                        src={course.teacherId?.profilePicture || "/gallery/avatar.jpg"}
                        alt="Instructor"
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Instructor Info */}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">

                          <Link
                            href={`/student/teacher/${course.teacherId?._id}?courseId=${course._id}`}
                            className="font-medium  "
                          >
                            {course.teacherId?.name || "Unknown Instructor"}
                          </Link>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2">
                          {course.teacherId && (
                            <Link href={`/student/chat/${course.teacherId._id}`}>
                              <Button
                                size="sm"
                                className="flex items-center gap-1 bg-gray-100 hover:bg-blue-700 hover:text-white text-black rounded-full px-3"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Chat
                              </Button>
                            </Link>
                          )}

                          <Link
                            href={`/student/teacher/call-shedule/${course.teacherId?._id}?courseId=${course._id}`}
                          >
                            <Button
                              size="sm"
                              className="flex items-center gap-1 bg-gray-100 hover:bg-green-700 hover:text-white text-black rounded-full px-3"
                            >
                              <VideoIcon className="w-4 h-4" />
                              Call
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* About Instructor */}
                      <p className="text-sm text-gray-600 mt-1 leading-snug max-w-xl">
                        {course.teacherId?.about
                          ? course.teacherId.about.length > 90
                            ? course.teacherId.about.slice(0, 90) + "..."
                            : course.teacherId.about
                          : "No details available"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>


              <Card className="mt-3">
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
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock2 className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium text-muted-foreground">
                        {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m
                      </span>
                    </div>

                    {/* <div>
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-medium flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {calculateAverageRating(course.reviews)}
                      </p>
                    </div> */}

                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>My Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={8}
                    placeholder="Write your thoughts or doubts here..."
                  />
                  <div className="flex justify-end mt-3">
                    <Button onClick={handleNotesSave}>Save Notes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compiler Tab */}
            <TabsContent value="compiler">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code2 className="w-5 h-5 mr-2" /> Online Compiler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <Button onClick={handleRunCode}>Run Code</Button>
                  </div>
                  <div className="bg-muted mt-4 p-3 rounded text-sm whitespace-pre-wrap">
                    {output || "Output will appear here..."}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Community Tab */}
            <TabsContent value="community">
              <Card>
                <CardHeader>
                  <CardTitle>Community Discussion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {comments.length === 0 && (
                      <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                    )}
                    {comments.map((msg, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between bg-muted p-3 rounded"
                      >
                        <p>{msg}</p>
                        <Trash2
                          className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-red-500"
                          onClick={() => {
                            const updated = comments.filter((_, idx) => idx !== i);
                            setComments(updated);
                            localStorage.setItem(`comments_${courseId}`, JSON.stringify(updated));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleAddComment}>
                      <Send className="w-4 h-4 mr-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
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

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2 mb-3" />
              <p className="text-sm text-muted-foreground">
                {completedLessonsCount}/{totalLessonsCount} lessons completed
              </p>
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
                        className={`flex items-center p-4 cursor-pointer hover:bg-muted transition-colors ${currentLesson?.id === lesson.id ? "bg-muted border-r-2 border-primary" : ""}`}
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
                            <p className={`text-sm font-medium truncate ${lesson.completed ? "text-foreground" : "text-muted-foreground"}`}>
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
  );
}
