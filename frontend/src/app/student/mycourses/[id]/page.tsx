"use client";

import { useState, useEffect, useRef } from "react";
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
  VideoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { studentCourseApi } from "@/services/APImethods/studentAPImethods";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import React from "react";

interface Lesson {
  _id: string;
  title: string;
  duration: number;
  videoFile?: string;
  completed: boolean;
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  percentage: number;
  lastVisitedLesson?: string;
  notes: string
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

interface StudentCourseResponse {
  course: Course;
  progress: CourseProgress;
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const [courseId, setCourseId] = useState<string>("");
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<string>("");
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [code, setCode] = useState("// Try some code here!"); // Fixed: Removed duplicate declaration
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(""); // Fixed: Removed duplicate declaration



  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      if (resolvedParams?.id) {
        setCourseId(resolvedParams.id);
        setComments(
          JSON.parse(localStorage.getItem(`comments_${resolvedParams.id}`) || "[]")
        );
      }
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await studentCourseApi.getMyCourseDetails(courseId);
      if (res.ok) {
        const { course: courseData, progress: progressData }: StudentCourseResponse = res.data;

        // Map module and lesson IDs and completion status
        const updatedModules = courseData.modules?.map((module, moduleIndex) => ({
          ...module,
          id: module._id,
          completed: progressData.completedModules?.includes(module._id) || false,
          lessons: module.lessons.map((lesson, lessonIndex) => ({
            ...lesson,
            id: lesson._id,
            completed: progressData.completedLessons?.includes(lesson._id) || false,
          })),
        }));

        setCourse({ ...courseData, modules: updatedModules });
        setProgress(progressData);
        setNotes(progressData.notes)

        // Set current lesson to last visited or first lesson
        const lastVisitedLessonId = progressData.lastVisitedLesson;
        const firstLesson = updatedModules?.[0]?.lessons?.[0] || null;
        const lastVisitedLesson = lastVisitedLessonId
          ? updatedModules
            ?.flatMap((m) => m.lessons)
            .find((l) => l._id === lastVisitedLessonId) || firstLesson
          : firstLesson;
        setCurrentLesson(lastVisitedLesson);
      } else {
        showErrorToast(res.message);
      }
    } catch (err) {
      showErrorToast("Failed to fetch course");
    } finally {
      setLoading(false);
    }
  };

  const totalLessonsCount = course?.modules?.flatMap((m) => m.lessons).length || 0;
  const completedLessonsCount = progress?.completedLessons?.length || 0;

  const markLessonComplete = async (lessonId: string) => {
    if (!course || !progress || progress.completedLessons?.includes(lessonId)) return;

    try {
      // Optimistically update the UI
      const updatedProgress = {
        ...progress,
        completedLessons: [...progress.completedLessons, lessonId],
        percentage: ((progress.completedLessons.length + 1) / totalLessonsCount) * 100,
      };

      setProgress(updatedProgress);

      // Update course and current lesson states based on the new progress
      setCourse((prev) => {
        if (!prev) return prev;
        const updatedModules = prev.modules?.map((mod) => ({
          ...mod,
          completed: updatedProgress.completedModules?.includes(mod._id) || false,
          lessons: mod.lessons.map((les) => ({
            ...les,
            completed: updatedProgress.completedLessons.includes(les._id),
          })),
        }));
        return { ...prev, modules: updatedModules };
      });

      setCurrentLesson((prev) => (prev && prev._id === lessonId ? { ...prev, completed: true } : prev));

      // Make API call to mark lesson complete
      const res = await studentCourseApi.markLessonComplete(course._id, lessonId);
      if (res.ok) {
        const serverProgress: CourseProgress = res.data;

        if (!Array.isArray(serverProgress.completedLessons)) {
          console.error("Invalid server response: completedLessons is not an array", serverProgress);
          await fetchCourse();
          showErrorToast("Invalid server response");
          return;
        }

        setProgress(serverProgress);

        setCourse((prev) => {
          if (!prev) return prev;
          const updatedModules = prev.modules?.map((mod) => ({
            ...mod,
            completed: serverProgress.completedModules?.includes(mod._id) || false,
            lessons: mod.lessons.map((les) => ({
              ...les,
              completed: serverProgress.completedLessons.includes(les._id),
            })),
          }));
          return { ...prev, modules: updatedModules };
        });

        setCurrentLesson((prev) =>
          prev && prev._id === lessonId ? { ...prev, completed: serverProgress.completedLessons.includes(lessonId) } : prev
        );

        showSuccessToast("Lesson marked as complete");
      } else {
        await fetchCourse();
        showErrorToast(res.message);
      }
    } catch (err) {
      await fetchCourse();
      showErrorToast("Failed to mark lesson complete");
    }
  };

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!courseId) return;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      try {
        if (!courseId) return;
        const res = await studentCourseApi.saveNotes({ courseId, notes });
        if (res.ok) {
          setProgress((prev) => prev ? { ...prev, notes: notes } : prev);
        } else {
          showErrorToast(res.message);
        }
      } catch (err) {
        showErrorToast("Failed to save notes");
      }
    }, 1000);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [notes, courseId]);


  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(`comments_${courseId}`, JSON.stringify(updated));
    setNewComment("");
    showSuccessToast("Comment added");
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput("Error: No code to execute.");
      return;
    }
    setOutput("Running...");
    try {
      const res = await studentCourseApi.codeRunner({ language, code });
      console.log("res of output:", res)
      setOutput(res.data);
    } catch (err) {
      setOutput("Error running code");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading course...
      </div>
    );

  if (!course || !progress)
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
                  onEnded={() => markLessonComplete(currentLesson._id)}
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
                  <CardTitle className="flex items-center gap-2">
                    <UserRound className="w-5 h-5" />
                    About Instructor
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300 shadow-sm">
                      <img
                        src={course.teacherId?.profilePicture || "/gallery/avatar.jpg"}
                        alt="Instructor"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/student/teacher/${course.teacherId?._id}?courseId=${course._id}`}
                            className="font-medium"
                          >
                            {course.teacherId?.name || "Unknown Instructor"}
                          </Link>
                        </div>
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
                    maxLength={1000}
                  />
                  <p style={{ textAlign: "right", fontSize: "0.9em", color: "#666" }}>
                    {notes.length}/1000
                  </p>

                </CardContent>
              </Card>
            </TabsContent>

            {/* Compiler Tab */}
            <TabsContent value="compiler">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code2 className="w-5 h-5 mr-2" />
                    Online Compiler
                  </CardTitle>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                    <option value="csharp">C#</option>
                    <option value="php">PHP</option>
                    <option value="go">Go</option>
                    <option value="ruby">Ruby</option>
                    <option value="sql">SQL</option>
                  </select>
                </CardHeader>
                <CardContent>
                  <Textarea
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <Button onClick={handleRunCode} disabled={loading}>
                      {loading ? "Running..." : "Run Code"}
                    </Button>
                  </div>
                  <div className="bg-muted mt-4 p-3 rounded text-sm whitespace-pre-wrap overflow-auto">
                    {language === "sql" && output.trim() ? (() => {
                      const rows = output.trim().split("\n").map(r => r.split("|"));
                      const headers = rows.shift();
                      if (!headers) return <p>No output</p>;

                      return (
                        <table className="border-collapse border border-gray-600 text-sm w-full text-left">
                          <thead>
                            <tr>
                              {headers.map((h, i) => (
                                <th key={i} className="border border-gray-600 p-2 bg-gray-200 dark:bg-gray-800">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, i) => (
                              <tr key={i}>
                                {row.map((col, j) => (
                                  <td key={j} className="border border-gray-600 p-2">{col}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    })() : (
                      <div>{output || "Output will appear here..."}</div>
                    )}
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
                        key={`comment-${i}`}
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
              <Progress value={progress.percentage} className="h-2 mb-3" />
              <p className="text-sm text-muted-foreground">
                {completedLessonsCount}/{totalLessonsCount} lessons completed
              </p>
            </CardContent>
          </Card>

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
                        key={lesson._id}
                        className={`flex items-center p-4 cursor-pointer hover:bg-muted transition-colors ${currentLesson?._id === lesson._id ? "bg-muted border-r-2 border-primary" : ""}`}
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
                        {currentLesson?._id === lesson._id && <Play className="w-4 h-4 text-primary" />}
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