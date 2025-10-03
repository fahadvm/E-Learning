"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star, Users, Clock, Globe, Award, Download, Smartphone,
  Shield, ChevronDown, ChevronUp, Play, Lock, Heart,
  ShoppingCart, Share2, MessageCircle
} from "lucide-react"
import Header from "@/components/student/header"
import { studentCartApi, studentCourseApi } from "@/services/APImethods/studentAPImethods"
import { useParams } from "next/navigation"
import { studentWishlistApi } from "@/services/APImethods/studentAPImethods"
import { showErrorToast, showSuccessToast } from "@/utils/Toast"

export default function CourseDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [expandedModules, setExpandedModules] = useState<number[]>([])
  const [courseData, setCourseData] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false);


  const handleAddToWishlist = async () => {
    try {
      setLoading(true);
      const res = await studentWishlistApi.addToWishlist({ courseId: id });
      if (res.ok) {
        showSuccessToast(res.message);
      }
    } catch (err: any) {
      console.error("Add to wishlist failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const res = await studentCartApi.addToCart({ courseId: id })
      if (res.ok) {
        showSuccessToast(res.message)
      }
    } catch (err) {
      console.error("Failed to remove course:", err);
    }
  };

  const getTotalLessons = (modules: any[]) => {
    return modules.reduce((total, module) => total + (module.lessons?.length || 0), 0);
  };

  useEffect(() => {
    async function fetchCourseData() {
      const res = await studentCourseApi.getCourseDetailById(id)
      console.log("res.data is", res.data)
      setCourseData(res.data)
      setModules(res.data.modules)
      setReviews(res.data.reviews)
    }
    fetchCourseData()
  }, [params.courseId])

  const toggleModule = (moduleIndex: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleIndex) ? prev.filter((i) => i !== moduleIndex) : [...prev, moduleIndex],
    )
  }

  if (!courseData) return <p className="text-center py-10">Loading...</p>

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header></Header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <section className="animate-fade-in-up">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  {courseData.category.toUpperCase()}
                </Badge>
                <h1 className="text-4xl font-black text-foreground mb-4 font-montserrat leading-tight">
                  {courseData.title.toUpperCase()}
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{courseData.shortDescription}</p>
              </div>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <img
                    src={courseData.teacherId.profilePicture || "/placeholder.svg"}
                    alt={courseData.teacherId.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{courseData.teacherId.name}</p>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(courseData.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div> */}
                  {/* <span className="font-semibold text-foreground">{courseData.rating}</span> */}
                  {/* <span className="text-muted-foreground">({courseData.reviewCount.toLocaleString()} reviews)</span> */}
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{courseData.enrolledStudents ? courseData.enrolledStudents.toLocaleString() : 0} students</span>
                </div>
              </div>


            </section>

            {/* Course Details */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Build responsive websites with HTML, CSS, and JavaScript",
                      "Master React.js and modern frontend development",
                      "Create full-stack applications with Node.js and Express",
                      "Work with databases using MongoDB and SQL",
                      "Deploy applications to production environments",
                      "Implement user authentication and security best practices",
                      "Use Git and GitHub for version control",
                      "Build RESTful APIs and work with third-party APIs",
                    ].map((outcome, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-foreground">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Course Content */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">Course Content</CardTitle>
                  {/* <p className="text-muted-foreground">
                    {courseData.modules} modules • {courseData.lessons} lessons • {courseData.duration} total length
                  </p> */}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="border border-border rounded-lg">
                        <button
                          onClick={() => toggleModule(moduleIndex)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <h3 className="font-semibold text-foreground">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.lessons.length} lessons</p>
                          </div>
                          {expandedModules.includes(moduleIndex) ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>

                        {expandedModules.includes(moduleIndex) && (
                          <div className="border-t border-border bg-muted/20">
                            {module.lessons.map((lesson: any, lessonIndex: any) => (
                              <div
                                key={lessonIndex}
                                className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.preview ? (
                                    <Play className="w-4 h-4 text-primary" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                  )}
                                  <span className="text-foreground">{lesson.title}</span>
                                  {lesson.preview && (
                                    <Badge variant="outline" className="text-xs">
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* What's Included */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">This Course Includes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: Clock, text: "42 hours on-demand video" },
                      { icon: Download, text: "Downloadable resources" },
                      { icon: Award, text: "Certificate of completion" },
                      { icon: Smartphone, text: "Access on mobile and TV" },
                      { icon: Globe, text: "Full lifetime access" },
                      { icon: Shield, text: "30-day money-back guarantee" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-primary" />
                        <span className="text-foreground">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Student Reviews */}
            {/* <section>
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">Student Reviews</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-foreground">{courseData.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({courseData.reviewCount?courseData.reviewCount.toLocaleString():100} reviews)</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div key={index} className="flex gap-4">
                        <img
                          src={review.image || "/placeholder.svg"}
                          alt={review.name}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-foreground">{review.name}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-foreground">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section> */}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <img
                      src={courseData.coverImage}
                      alt="Course preview"
                      className="  object-cover rounded-lg shadow-lg"
                    />
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-foreground">₹{courseData.price}</span>
                      {/* <span className="text-lg text-muted-foreground line-through">${courseData.originalPrice}</span> */}
                    </div>
                    <Badge variant="destructive" className="mb-4">
                      55% OFF - Limited Time
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3" onClick={handleAddToCart} disabled={loading}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={handleAddToWishlist}
                      disabled={loading}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {loading ? "Adding..." : "Add to Wishlist"}
                    </Button>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Secure payment with</p>
                    <div className="flex justify-center gap-2">
                      <div className="px-2 py-1 bg-muted rounded text-xs font-semibold">VISA</div>
                      <div className="px-2 py-1 bg-muted rounded text-xs font-semibold">MC</div>
                      <div className="px-2 py-1 bg-muted rounded text-xs font-semibold">PayPal</div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-foreground font-semibold">{courseData.totalDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons:</span>
                      <span className="text-foreground font-semibold">{getTotalLessons(modules)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <span className="text-foreground font-semibold">{courseData.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="text-foreground font-semibold">{courseData.language}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-center gap-4">
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Help
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 inline mr-1" />
                      30-day money-back guarantee
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <Button className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90">
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
