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
  VideoIcon,
  FileText,
  MessageCircle,
  Copy,
  RotateCcw,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { studentCourseApi } from "@/services/APIservices/studentApiservice";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import React from "react";
import AiTutorChat from "@/components/student/aiBot/AiTutorChat";
import RecommendedCourses from "@/components/student/course/RecommendedCourses";
import { ICourse } from "@/types/student/studentTypes";
import CourseReviewModal from "@/components/student/course/CourseReviewModal";
import ReviewListModal from "@/components/student/course/ReviewList";

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
  notes: string
}

interface Course {
  _id: string;
  title: string;
  category: string;
  coverImage?: string;
  totalDuration: number;
  isTechnicalCourse: boolean;
  teacherId?: {
    _id: string;
    name: string;
    email: string;
    about: string;
    profilePicture: string;
  };
  totalStudents?: number;
  reviewCount:number;
  averageRating:number;
  description?: string;
  modules?: Module[];
}

interface StudentCourseResponse {
  course: Course;
  progress: CourseProgress;
  recommended: ICourse[]
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
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [code, setCode] = useState("// Try some code here!");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [recommended, setRecommended] = useState<ICourse[]>([])
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [openReviewListModal, setOpenReviewListModal] = useState(false);
  const [reviews, setReviews] = useState([]);





  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      if (resolvedParams?.id) {
        setCourseId(resolvedParams.id);
      }
    };

    fetchParams();
  }, [params]);


  useEffect(() => {
    if (!courseId) return;
    const fetchComments = async () => {
      try {
        const res = await studentCourseApi.getCourseComments(courseId);
        console.log("res in comment", res.data)
        if (res.ok) setComments(res.data);
        else showErrorToast(res.message);
      } catch {
        showErrorToast("Failed to load comments");
      }
    };
    fetchComments();
  }, [courseId]);



  useEffect(() => {
    if (!courseId) return;
    const fetchReviews = async () => {
      try {
        const res = await studentCourseApi.getCourseReviews(courseId);
        console.log("res in Reviews", res.data)
        if (res.ok) setReviews(res.data);
        else showErrorToast(res.message);
      } catch {
        showErrorToast("Failed to load Reviews");
      }
    };
    fetchReviews();
  }, [courseId]);

  const handleSubmitReview = async (rating: number, comment: string) => {
    await await studentCourseApi.addCourseReview({ courseId, rating, comment });
  };



  const handleCopyOutput = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    showSuccessToast("Output copied successfull")
  }

  const handleReset = () => {
    setCode("")
    setOutput("")
  }


  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await studentCourseApi.addCourseComment(courseId, { content: newComment });
      if (res.ok) {
        console.log("added comment backend response is :", res.data)
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

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await studentCourseApi.deleteCourseComment(commentId);
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


  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await studentCourseApi.getMyCourseDetails(courseId);
      if (res.ok) {
        const { course: courseData, progress: progressData, recommended: recommendedCourses }: StudentCourseResponse = res.data;

        // Map module and lesson IDs and completion status
        const updatedModules = courseData.modules?.map((module) => ({
          ...module,
          id: module._id,
          completed: progressData.completedModules?.includes(module._id) || false,
          lessons: module.lessons.map((lesson) => ({
            ...lesson,
            id: lesson._id,
            completed: progressData.completedLessons?.includes(lesson._id) || false,
          })),
        }));

        setCourse({ ...courseData, modules: updatedModules });
        setProgress(progressData);
        setNotes(progressData.notes)
        setRecommended(recommendedCourses)

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
    } catch(err){
      showErrorToast("Failed to fetch course");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async (fileUrl: string) => {
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();

      // Extract filename from Cloudinary URL
      const urlParts = fileUrl.split("/");
      console.log("original name is :", urlParts)
      let originalFilename = urlParts[urlParts.length - 1]; // e.g., 1760538617694_Naveen.pdf

      // Ensure it keeps the correct extension
      if (!originalFilename.includes(".")) {
        // fallback: use extension from fileUrl query if present, or default pdf
        originalFilename += ".pdf";
      }

      // Create download link
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = originalFilename; // force proper name with extension
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };


  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await studentCourseApi.getCourseResources(courseId);
        setResources(response.data || []);
      } catch (err) {
         console.log(err)
        showErrorToast("Failed to load course resources");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchResources();
  }, [courseId]);

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
      console.log(err)
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
        console.log(err)
        showErrorToast("Failed to save notes");
      }
    }, 1000);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [notes, courseId]);



  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput("or: No code to execute.");
      return;
    }
    setOutput("Running...");
    try {
      const res = await studentCourseApi.codeRunner({ language, code });
      console.log("res of output:", res)
      setOutput(res.data);
    } catch (err) {
      console.log(err)
      setOutput("or running code");
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
        Loading course...
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
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Overview
              </TabsTrigger>

              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes
              </TabsTrigger>

              {course?.isTechnicalCourse && (
                <TabsTrigger value="compiler" className="flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Compiler
                </TabsTrigger>
              )}



              <TabsTrigger value="community" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Community
              </TabsTrigger>

              <TabsTrigger value="resources" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Resources
              </TabsTrigger>
            </TabsList>






            {/* Overview Tab */}
            {/* <TabsContent value="overview">
              <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Usound className="w-5 h-5" />
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
                                className="flex items-center gap-1 bg-gray-100 hover:bg-purple-700 hover:text-white text-black rounded-full px-3"
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
                    Course Description {course.isTechnicalCourse}
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
            </TabsContent> */}
            {/* Overview Tab - Upgraded with Related Courses */}
            <TabsContent value="overview" className="space-y-6">
              {/* Instructor Card */}
              <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    About Instructor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={course.teacherId?.profilePicture || "/gallery/avatar.jpg"}
                        alt="Instructor"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <Link
                            href={`/student/teacher/${course.teacherId?._id}?courseId=${course._id}`}
                            className="text-lg font-semibold hover:text-primary transition-colors"
                          >
                            {course.teacherId?.name || "Unknown Instructor"}
                          </Link>
                          <p className="text-sm text-muted-foreground">Expert Instructor • {course.totalStudents || 1200}+ Students</p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/student/chat/${course.teacherId?._id}`}>
                            <Button size="sm" className="rounded-full bg-primary hover:bg-purple-700">
                              <MessageCircle className="w-4 h-4 mr-1" /> Chat
                            </Button>
                          </Link>
                          <Link href={`/student/teacher/call-shedule/${course.teacherId?._id}?courseId=${course._id}`}>
                            <Button size="sm" variant="outline" className="rounded-full border-green-600 text-green-600 hover:bg-green-700">
                              <VideoIcon className="w-4 h-4 mr-1" /> Book Call
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {course.teacherId?.about || "Passionate educator helping students master programming and technology."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Description */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary-700 dark:text-purple-300">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Course Description
                  </CardTitle>

                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{course.description}</p>
                                    <button
                    onClick={() => setOpenReviewModal(true)}
                    className="mt-10 bg-primary hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Write a Review
                  </button>
                  <Separator className="my-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/50 rounded-lg">
                      <Clock2 className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-muted-foreground">{Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/50 rounded-lg">
                      <Star className="w-6 h-6 text-yellow-500" />
                     <div
        className="cursor-pointer select-none"
        onClick={() => setOpenReviewListModal(true)}
      >
        <p className="font-medium">Rating</p>
        <p className="text-muted-foreground">
          {course.averageRating ?? 0} ({course.reviewCount ?? 0} reviews)
        </p>
      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/50 rounded-lg">
                      <Code2 className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium">Type</p>
                        <p className="text-muted-foreground">{course.isTechnicalCourse ? "Technical" : "Conceptual"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>



              {/* Related Courses Section - MOCK DATA */}
              <RecommendedCourses courses={recommended} />
            </TabsContent>



            {/* Community Tab - Modern Chat UI */}
            <TabsContent value="community">
              <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 h-full">

                <CardContent className="p-0 flex flex-col h-96">
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {comments.length === 0 ? (
                      <div className="text-center py-10">
                        <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-muted-foreground">No comments yet. Be the first to ask!</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3 group">
                          <img
                            src={comment.userId?.profilePicture || "/gallery/avatar.jpg"}
                            alt={comment.userId?.name}
                            className="w-10 h-10 rounded-full ring-2 ring-gray-200"
                          />
                          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-sm">{comment.userId?.name || "Anonymous"}</p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm mt-1 text-foreground">{comment.content}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question or share a tip..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment()}
                        className="flex-1"
                      />
                      <Button onClick={handleAddComment} className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-700 hover:to-purple-700">
                        <Send className="w-4 h-4" />
                      </Button>
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
              <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20 p-4">
                <div className="grid grid-cols-1 gap-6">


                  {/* Editor Section */}
                  <div className=" space-y-4">
                    <Card className="border border-primary/10 shadow-lg">
                      <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-primary" />
                            Code Editor
                          </CardTitle>

                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-primary/5 border border-primary/20 text-foreground rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 hover:bg-primary/10"
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
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <Textarea
                          spellCheck={false}
                          autoCorrect="off"
                          autoCapitalize="off"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          rows={12}
                          className="font-mono text-sm bg-card border-primary/20 text-foreground placeholder:text-muted-foreground focus:ring-primary/50 resize-none"
                          placeholder="Write your code here..."
                        />

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={handleRunCode}
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 flex-1 sm:flex-none"
                          >
                            <Play className="w-4 h-4" />
                            {loading ? "Running..." : "Run Code"}
                          </Button>

                          <Button
                            onClick={handleReset}
                            variant="outline"
                            className="border-primary/20 hover:bg-primary/5 gap-2 flex-1 sm:flex-none"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Output Section */}
                  <div className="space-y-4">
                    <Card className="border border-primary/10 shadow-lg h-full flex flex-col">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Output</CardTitle>
                          {output && (
                            <Button
                              onClick={handleCopyOutput}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 overflow-hidden flex flex-col">
                        <div className="flex-1 bg-card/50 border border-primary/10 rounded-md p-4 overflow-auto font-mono text-sm text-foreground/80 whitespace-pre-wrap break-words">

                          {/* SQL TABLE OUTPUT */}
                          {language === "sql" && output.trim() ? (() => {
                            const rows = output.trim().split("\n").map(r => r.split("|"))
                            const headers = rows.shift()
                            if (!headers) return <p className="text-muted-foreground">No output</p>

                            return (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr>
                                      {headers.map((h, i) => (
                                        <th key={i} className="border border-primary/20 px-3 py-2 bg-primary/5 font-semibold text-foreground">
                                          {h}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {rows.map((row, i) => (
                                      <tr key={i}>
                                        {row.map((col, j) => (
                                          <td key={j} className="border border-primary/20 px-3 py-2">
                                            {col}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )
                          })() : (
                            <div className="text-muted-foreground">
                              {output || "Output will appear here..."}
                            </div>
                          )}

                        </div>
                      </CardContent>
                    </Card>
                  </div>

                </div>
              </div>
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
              <Progress value={progress?.percentage ?? 0} className="h-2 mb-3" />
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
                    <div className="p-4 bg-muted/50 font-medium text-sm" >
                      {module.title} : <span className="text-muted-foreground font-normal">{module.description}</span>
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
      <ReviewListModal
        open={openReviewListModal}
        onClose={() => setOpenReviewListModal(false)}
        reviews={reviews}
      />
    


      <CourseReviewModal
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        onSubmit={handleSubmitReview}
      />

      <div className="fixed bottom-6 right-6">
        <div className="fixed bottom-6 right-6">
          <AiTutorChat courseId={courseId} />
        </div>
      </div>
    </div>
  );
}