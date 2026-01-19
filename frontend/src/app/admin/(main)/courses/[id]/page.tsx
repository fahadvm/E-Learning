'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Users,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  PlayCircle,
  FileText,
  TrendingUp,
  BarChart3,
  Calendar,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  Layers,
  ShieldAlert,
} from 'lucide-react'
import { adminApiMethods } from '@/services/APIservices/adminApiService'
import ConfirmationDialog from '@/reusable/ConfirmationDialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { showSuccessToast, showErrorToast } from '@/utils/Toast'

interface ILesson {
  title: string
  content?: string
  thumbnail?: string
  videoFile?: string
  duration?: number
}

interface IModule {
  title: string
  description?: string
  lessons: ILesson[]
}

interface ITeacher {
  _id: string
  name: string
  email: string
  profilePicture?: string
  about?: string
}

interface ICourse {
  _id: string
  title: string
  subtitle?: string
  description: string
  level: string
  category: string
  price?: number
  coverImage?: string
  modules: IModule[]
  createdAt: string
  updatedAt: string
  isBlocked: boolean
  blockReason?: string
  isVerified: boolean
  isPublished: boolean
  status: string
  adminRemarks?: string
  teacherId: ITeacher
  totalStudents: number
  totalDuration?: number
  learningOutcomes?: string[]
  requirements?: string[]
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<ICourse | null>(null)
  const [loading, setLoading] = useState(true)
  const [openModules, setOpenModules] = useState<{ [key: number]: boolean }>({ 0: true })
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)

  // Verification states
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectRemarks, setRejectRemarks] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [analytics, setAnalytics] = useState<{ month: string; count: number }[]>([])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      const res = await adminApiMethods.getCourseById(id as string)
      setCourse(res.data)
    } catch (err) {
      console.error('Failed to fetch course', err)
      showErrorToast('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const res = await adminApiMethods.getCourseAnalytics(id as string)
      setAnalytics(res.data)
    } catch (err) {
      console.error('Failed to fetch analytics', err)
    }
  }

  useEffect(() => {
    if (id) {
      fetchCourse()
      fetchAnalytics()
    }
  }, [id])

  const toggleModule = (index: number) => {
    setOpenModules(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleVerify = async () => {
    try {
      setIsProcessing(true)
      await adminApiMethods.verifyCourse(id as string)
      showSuccessToast('Course verified and published successfully')
      fetchCourse()
    } catch (err) {
      console.error("Verification failed", err)
      showErrorToast('Verification failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectRemarks.trim()) return
    try {
      setIsProcessing(true)
      await adminApiMethods.rejectCourse(id as string, rejectRemarks)
      setRejectDialogOpen(false)
      setRejectRemarks("")
      showSuccessToast('Course rejected')
      fetchCourse()
    } catch (err) {
      console.error("Rejection failed", err)
      showErrorToast('Rejection failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const blockCourse = async () => {
    const reason = window.prompt('Please enter a reason for blocking this course:')
    if (reason === null) return

    try {
      setIsProcessing(true)
      await adminApiMethods.blockCourse(id as string, reason || 'No reason provided')
      showSuccessToast('Course blocked successfully')
      fetchCourse()
    } catch (err) {
      console.error('Failed to block course', err)
      showErrorToast('Failed to block course')
    } finally {
      setIsProcessing(false)
    }
  }

  const unblockCourse = async () => {
    try {
      setIsProcessing(true)
      await adminApiMethods.unblockCourse(id as string)
      showSuccessToast('Course unblocked successfully')
      fetchCourse()
    } catch (err) {
      console.error('Failed to unblock course', err)
      showErrorToast('Failed to unblock course')
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-medium tracking-wide">Fetching Course Data...</p>
    </div>
  )

  if (!course) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Badge variant="destructive" className="px-4 py-1 text-sm">Not Found</Badge>
      <h2 className="text-2xl font-bold text-slate-900">Course not found</h2>
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
      </Button>
    </div>
  )

  const formatDuration = (min?: number) => {
    if (!min) return '0m'
    const h = Math.floor(min / 60)
    const m = min % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  return (
    <div className="container mx-auto max-w-7xl animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{course.title}</h1>
              <Badge
                variant={course.status === 'published' ? 'default' : course.status === 'pending' ? 'secondary' : 'destructive'}
                className="capitalize"
              >
                {course.status}
              </Badge>
            </div>
            <p className="text-slate-500 max-w-2xl truncate">{course.subtitle || 'Course Details and Moderation'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(!course.isVerified && course.status !== 'rejected') && (
            <>
              <Button
                onClick={handleVerify}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Verify & Publish
              </Button>
              <Button
                variant="destructive"
                onClick={() => setRejectDialogOpen(true)}
                disabled={isProcessing}
              >
                <XCircle className="w-4 h-4 mr-2" /> Reject
              </Button>
            </>
          )}

          <ConfirmationDialog
            title={course.isBlocked ? 'Unblock Course' : 'Block Course'}
            description={
              course.isBlocked
                ? 'Are you sure you want to unblock this course? It will be visible to users again.'
                : 'Blocking this course will hide it from all students. Continue?'
            }
            confirmText={course.isBlocked ? 'Unblock' : 'Block'}
            onConfirm={course.isBlocked ? unblockCourse : blockCourse}
            triggerButton={
              <Button
                variant={course.isBlocked ? 'secondary' : 'outline'}
                className={!course.isBlocked ? "border-red-200 text-red-600 hover:bg-red-50" : ""}
                disabled={isProcessing}
              >
                {course.isBlocked ? <PlayCircle className="w-4 h-4 mr-2" /> : <ShieldAlert className="w-4 h-4 mr-2" />}
                {course.isBlocked ? 'Unblock Course' : 'Block Course'}
              </Button>
            }
          />
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border p-1 h-12 shadow-sm rounded-xl w-full sm:w-auto">
          <TabsTrigger value="overview" className="px-8 h-full data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="curriculum" className="px-8 h-full data-[state=active]:shadow-sm">Curriculum</TabsTrigger>
          <TabsTrigger value="reports" className="px-8 h-full data-[state=active]:shadow-sm">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden border-slate-200/60 shadow-md">
                <div className="aspect-video relative w-full overflow-hidden bg-slate-100">
                  {course.coverImage ? (
                    <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
                </CardContent>
              </Card>

              {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                <Card className="border-slate-200/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">What students will learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {course.learningOutcomes.map((item, idx) => (
                        <div key={idx} className="flex gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {course.blockReason && (
                <Card className="border-red-100 bg-red-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-red-700 text-base flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Blocked Reason
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-600 text-sm">{course.blockReason}</p>
                  </CardContent>
                </Card>
              )}

              {course.adminRemarks && (
                <Card className="border-amber-100 bg-amber-50/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-amber-700 text-base flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Admin Remarks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-amber-600 text-sm whitespace-pre-wrap">{course.adminRemarks}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: Sidebar Stats & Info */}
            <div className="space-y-6">
              <Card className="border-slate-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Course Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Enrollments</span>
                    </div>
                    <span className="font-bold text-slate-900">{course.totalStudents}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Duration</span>
                    </div>
                    <span className="font-bold text-slate-900">{formatDuration(course.totalDuration)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Layers className="w-4 h-4" />
                      <span className="text-sm">Modules</span>
                    </div>
                    <span className="font-bold text-slate-900">{course.modules.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Info className="w-4 h-4" />
                      <span className="text-sm">Level</span>
                    </div>
                    <Badge variant="outline" className="capitalize">{course.level}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm">Category</span>
                    </div>
                    <span className="text-sm font-medium">{course.category}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Instructor Card */}
              <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-lg">Instructor Profile</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-primary/10">
                    <AvatarImage src={course.teacherId.profilePicture} />
                    <AvatarFallback className="bg-slate-200 text-lg">{course.teacherId.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-slate-900">{course.teacherId.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{course.teacherId.email}</p>
                  <Separator className="my-4" />
                  <p className="text-sm text-slate-600 line-clamp-3 italic">
                    {course.teacherId.about || "Experienced educator dedicated to teaching high-quality technical skills."}
                  </p>
                  <Button variant="link" className="text-primary mt-2" onClick={() => router.push(`/admin/teachers/${course.teacherId._id}`)}>
                    View Full Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Created:</span>
                    <span className="text-slate-700 font-medium">{new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Last Updated:</span>
                    <span className="text-slate-700 font-medium">{new Date(course.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-6">
          <Card className="border-slate-200/60 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>Review the modules and lessons included in this course</CardDescription>
              </div>
              <Badge variant="outline" className="text-slate-500">
                {course.modules.length} Modules Total
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.modules.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No modules have been added to this course yet.</p>
                  </div>
                ) : (
                  course.modules.map((module, mIdx) => (
                    <div key={mIdx} className="border rounded-xl overflow-hidden bg-slate-50/30">
                      <button
                        onClick={() => toggleModule(mIdx)}
                        className="w-full flex items-center justify-between p-4 bg-white border-b hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {mIdx + 1}
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{module.title}</h4>
                            <p className="text-xs text-slate-500">{module.lessons.length} Lessons</p>
                          </div>
                        </div>
                        {openModules[mIdx] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </button>

                      {openModules[mIdx] && (
                        <div className="p-4 bg-white animate-in slide-in-from-top-2 duration-300">
                          {module.description && (
                            <p className="text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">{module.description}</p>
                          )}
                          <div className="space-y-3">
                            {module.lessons.map((lesson, lIdx) => (
                              <div key={lIdx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                    <PlayCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-800">{lesson.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      {lesson.duration && (
                                        <span className="text-[10px] text-slate-400 flex items-center">
                                          <Clock className="w-2.5 h-2.5 mr-0.5" /> {lesson.duration}m
                                        </span>
                                      )}
                                      {lesson.videoFile && <Badge variant="secondary" className="text-[9px] h-3.5 px-1.5 uppercase tracking-wider">Video</Badge>}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {lesson.videoFile && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 gap-2 text-[11px]"
                                      onClick={() => setPreviewVideo(lesson.videoFile || null)}
                                    >
                                      <PlayCircle className="w-3.5 h-3.5" /> Preview
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0">
                                    <Info className="w-4 h-4 text-slate-400" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-slate-200/60 shadow-sm p-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900">{course.totalStudents}</h3>
              <p className="text-slate-500 text-sm">Total Students</p>
            </Card>
            <Card className="border-slate-200/60 shadow-sm p-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900">84%</h3>
              <p className="text-slate-500 text-sm">Completion Rate</p>
            </Card>
            <Card className="border-slate-200/60 shadow-sm p-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900">4.8</h3>
              <p className="text-slate-500 text-sm">Average Rating</p>
            </Card>
            <Card className="border-slate-200/60 shadow-sm p-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900">12</h3>
              <p className="text-slate-500 text-sm">New this Month</p>
            </Card>
          </div>

          <Card className="border-slate-200/60 shadow-md">
            <CardHeader>
              <CardTitle>Enrollment Analytics</CardTitle>
              <CardDescription>Trends and insights for the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-slate-50 rounded-xl flex items-end justify-between p-8 gap-4 overflow-x-auto">
                {analytics.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 italic">
                    <TrendingUp className="w-8 h-8 mr-2 opacity-20" /> No enrollment data available for the last 6 months
                  </div>
                ) : (
                  analytics.map((val, idx) => {
                    const maxCount = Math.max(...analytics.map(a => a.count), 1);
                    const heightPercent = (val.count / maxCount) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 min-w-[60px]">
                        <div className="text-[10px] font-bold text-primary mb-1">{val.count}</div>
                        <div
                          className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all duration-700 ease-out border-x border-t border-primary/10"
                          style={{ height: `${Math.max(heightPercent, 5)}%` }}
                        />
                        <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">{val.month}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Reject Course Submission</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-3 text-sm text-amber-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p>Rejection will notify the instructor. Please provide specific reasons to help them improve.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Detailed Feedback / Remarks</label>
              <Textarea
                placeholder="Content contains outdated information, missing core resources, etc..."
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                className="min-h-[120px] rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="rounded-xl px-6">Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectRemarks.trim() || isProcessing}
              className="rounded-xl px-6 shadow-md shadow-red-100"
            >
              {isProcessing ? 'Processing...' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Preview Dialog */}
      <Dialog open={!!previewVideo} onOpenChange={() => setPreviewVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none rounded-2xl">
          <div className="aspect-video w-full">
            {previewVideo && (
              <video
                src={previewVideo}
                controls
                autoPlay
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
