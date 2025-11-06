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
  FileText,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import React from "react";
import AiTutorChat from "@/components/student/aiBot/AiTutorChat";
import { studentCourseApi } from "@/services/APIservices/studentApiservice";

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
  description: string;
  lessons: Lesson[];
}

interface Comment {
  _id: string;
  content: string;
  userId: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
}

interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  percentage: number;
  lastVisitedLesson?: string;
  notes: string;
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

interface Resource {
  _id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const [courseId, setCourseId] = useState<string>("");
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [pendingLesson, setPendingLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [code, setCode] = useState("// Try some code here!");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [watchTime, setWatchTime] = useState<number>(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);


  const watchSessionRef = useRef<{
    startTime: number;
    accumulated: number;
    rafId: number | null;
    saveTimeout: NodeJS.Timeout | null;
  }>({
    startTime: 0,
    accumulated: 0,
    rafId: null,
    saveTimeout: null,
  });

  const isTrackingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // === Resolve course ID from params ===
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      if (resolvedParams?.id) {
        setCourseId(resolvedParams.id);
      }
    };
    fetchParams();
  }, [params]);

  // === Fetch Comments ===
  useEffect(() => {
    if (!courseId) return;
    const fetchComments = async () => {
      try {
        const res = await employeeApiMethods.getCourseComments(courseId);
        if (res.ok) setComments(res.data);
        else showErrorToast(res.message);
      } catch {
        showErrorToast("Failed to load comments");
      }
    };
    fetchComments();
  }, [courseId]);

  // === Add Comment ===
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await employeeApiMethods.addCourseComment(courseId, { content: newComment });
      if (res.ok) {
        setComments((prev) => [...prev, res.data]);
        setNewComment("");
        showSuccessToast("Comment added");
      } else {
        showErrorToast(res.message);
      }
    } catch {
      showErrorToast("Failed to add comment");
    }
  };

  // === Delete Comment ===
  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await employeeApiMethods.deleteCourseComment(commentId);
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        showSuccessToast("Comment deleted");
      } else {
        showErrorToast(res.message);
      }
    } catch {
      showErrorToast("Failed to delete comment");
    }
  };

  // === Fetch Course ===
  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await employeeApiMethods.getMyCourseDetails(courseId);
      if (res.ok) {
        const { course: courseData, progress: progressData }: StudentCourseResponse = res.data;

        const updatedModules = courseData.modules?.map((module) => ({
          ...module,
          completed: progressData.completedModules?.includes(module._id) || false,
          lessons: module.lessons.map((lesson) => ({
            ...lesson,
            completed: progressData.completedLessons?.includes(lesson._id) || false,
          })),
        }));

        setCourse({ ...courseData, modules: updatedModules });
        setProgress(progressData);
        setNotes(progressData.notes);

        const lastVisitedLessonId = progressData.lastVisitedLesson;
        const firstLesson = updatedModules?.[0]?.lessons?.[0] || null;
        const lastVisitedLesson = lastVisitedLessonId
          ? updatedModules?.flatMap((m) => m.lessons).find((l) => l._id === lastVisitedLessonId) || firstLesson
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

  // === Download Resource ===
  const handleDownload = async (fileUrl: string) => {
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const urlParts = fileUrl.split("/");
      let originalFilename = urlParts[urlParts.length - 1];
      if (!originalFilename.includes(".")) originalFilename += ".pdf";

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = originalFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // === Fetch Resources ===
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await employeeApiMethods.getCourseResources(courseId);
        setResources(response.data || []);
      } catch (err) {
        showErrorToast("Failed to load course resources");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchResources();
  }, [courseId]);


  // === Accurate Time Tracking ===
  useEffect(() => {
    if (!courseId) return;

    let totalSeconds = 0;
    let lastSent = 0;

    const tickTimer = setInterval(() => {
      totalSeconds++;
      setTotalTimeSpent(totalSeconds);
    }, 1000);

    const saveTimer = setInterval(async () => {
      const delta = totalSeconds - lastSent;
      if (delta > 0) {
        try {
          await employeeApiMethods.trackLearningTime({ courseId, seconds: delta });
          console.log(`⏱ Sent ${delta}s for ${courseId}`);
          lastSent = totalSeconds;
        } catch (err) {
          console.warn("Failed to save learning time:", err);
        }
      }
    }, 30000); // every 30s

    const unloadHandler = async () => {
      const delta = totalSeconds - lastSent;
      if (delta > 0) {
        try {
          await employeeApiMethods.trackLearningTime({ courseId, seconds: delta });
        } catch (err) {
          console.warn("Final save failed", err);
        }
      }
    };

    window.addEventListener("beforeunload", unloadHandler);
    window.addEventListener("pagehide", unloadHandler);

    return () => {
      clearInterval(tickTimer);
      clearInterval(saveTimer);
      window.removeEventListener("beforeunload", unloadHandler);
      window.removeEventListener("pagehide", unloadHandler);
    };
  }, [courseId]);



  // === Safe lesson switch (debounced) ===
  const setCurrentLessonSafe = (lesson: Lesson) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setPendingLesson(lesson);
    debounceRef.current = setTimeout(() => {
      if (pendingLesson?._id === lesson._id) {
        setCurrentLesson(lesson);
      }
    }, 300);
  };

  // === Mark Lesson Complete ===
  const totalLessonsCount = course?.modules?.flatMap((m) => m.lessons).length || 0;
  const completedLessonsCount = progress?.completedLessons?.length || 0;

  const markLessonComplete = async (lessonId: string) => {
    if (!course || !progress || progress.completedLessons?.includes(lessonId)) return;

    try {
      const updatedProgress = {
        ...progress,
        completedLessons: [...progress.completedLessons, lessonId],
        percentage: ((progress.completedLessons.length + 1) / totalLessonsCount) * 100,
      };

      setProgress(updatedProgress);
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

      const res = await employeeApiMethods.markLessonComplete(course._id, lessonId);
      if (res.ok) {
        const serverProgress: CourseProgress = res.data;
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

  // === Notes Auto-save ===
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!courseId) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      try {
        if (!courseId) return;
        const res = await employeeApiMethods.saveNotes({ courseId, notes });
        if (res.ok) {
          setProgress((prev) => prev ? { ...prev, notes } : prev);
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

  // === Run Code ===
  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput("Error: No code to execute.");
      return;
    }
    setOutput("Running...");
    try {
      const res = await studentCourseApi.codeRunner({ language, code });
      setOutput(res.data);
    } catch (err) {
      setOutput("Error running code");
    }
  };

  // === Render Loading / Not Found ===
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
          <Link href="/employee/learningpath">
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
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="compiler" className="flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Compiler
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Community
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Overview */}
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
                            href={`/employee/teacher/${course.teacherId?._id}?courseId=${course._id}`}
                            className="font-medium"
                          >
                            {course.teacherId?.name || "Unknown Instructor"}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2">
                          {course.teacherId && (
                            <Link href={`/employee/chat/${course.teacherId._id}`}>
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
                            href={`/employee/teacher/call-shedule/${course.teacherId?._id}?courseId=${course._id}`}
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
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Watched:</span>
                      <span className="font-medium text-muted-foreground">
                        {Math.floor(watchTime / 60)}m {watchTime % 60}s
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notes */}
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
                  <p className="text-right text-xs text-gray-500 mt-1">
                    {notes.length}/1000
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compiler */}
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

            {/* Community */}
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
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="flex items-start justify-between bg-muted p-3 rounded"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={comment.userId?.profilePicture || "/gallery/avatar.jpg"}
                            alt="User"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-sm">{comment.userId?.name || "Anonymous"}</p>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Trash2
                          className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-red-500"
                          onClick={() => handleDeleteComment(comment._id)}
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

            {/* Resources */}
            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    Course Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p>Loading resources...</p>
                  ) : resources.length === 0 ? (
                    <p className="text-muted-foreground">No resources uploaded yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {resources.map((res) => (
                        <div
                          key={res._id}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{res.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {res.fileType.toUpperCase()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(res.fileUrl)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <div key={module._id} className="border-b border-border last:border-b-0">
                    <div className="p-4 bg-muted/50 font-medium text-sm">
                      {module.title} : <span className="text-muted-foreground font-normal">{module.description}</span>
                    </div>
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson._id}
                        className={`flex items-center p-4 cursor-pointer hover:bg-muted transition-colors ${currentLesson?._id === lesson._id ? "bg-muted border-r-2 border-primary" : ""}`}
                        onClick={() => setCurrentLessonSafe(lesson)}
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

      {/* AI Tutor Chat */}
      <div className="fixed bottom-6 right-6">
        <AiTutorChat courseId={courseId} />
      </div>
    </div>
  );
}