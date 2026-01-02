"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, TrendingUp, ShoppingCart, AlertCircle } from "lucide-react";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import { useRouter } from "next/navigation";
import Header from "@/components/company/Header";




interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  category: string;
  coverImage?: string;
  totalDuration?: number;
  seatsPurchased: number;
  seatsUsed: number;
  remainingSeats: number;
}


const MyCoursesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingSeats, setBuyingSeats] = useState<string | null>(null);
  const [additionalSeats, setAdditionalSeats] = useState<{ [key: string]: number }>({});

  // Fetch courses dynamically
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await companyApiMethods.getmycourses();
      console.log("API Response My Courses:", res.data);

      interface CourseEnrollment {
        courseId: Partial<Course>;
        seatsPurchased: number;
        seatsUsed: number;
      }

      const mappedCourses = (res?.data as CourseEnrollment[])?.map((item) => ({
        ...item.courseId,
        seatsPurchased: item.seatsPurchased,
        seatsUsed: item.seatsUsed,
        remainingSeats: item.seatsPurchased - item.seatsUsed
      })) as Course[];

      setCourses(mappedCourses);
    } catch (error: unknown) {
      console.error("Failed to fetch courses:", error);
      showErrorToast("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };


  const handleBuyMoreSeats = async (courseId: string) => {
    const seats = additionalSeats[courseId] || 1;

    if (seats < 1) {
      showErrorToast("Please enter a valid number of seats");
      return;
    }

    try {
      // Add to cart with additional seats
      await companyApiMethods.addToCart({ courseId, seats });
      showSuccessToast(`Added ${seats} seats to cart`);

      // Redirect to cart
      router.push("/company/cart");
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to add to cart";
      showErrorToast(errorMessage);
    }
  };

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const search = searchTerm.toLowerCase();
    return (
      course?.title?.toLowerCase().includes(search) ||
      course?.category?.toLowerCase().includes(search) ||
      course?.subtitle?.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-hero">

        <div className="mt-10 container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              My Courses
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your purchased courses and seat allocations
            </p>
          </div>

          {/* Search + Actions */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="default">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>

          {/* Course List */}
          {loading ? (
            <div className="text-center py-16">Loading courses...</div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const totalSeats = course.seatsPurchased;
                const assignedSeats = course.seatsUsed;
                const remainingSeats = totalSeats - assignedSeats;

                const seatUsagePercent = totalSeats > 0 ? (assignedSeats / totalSeats) * 100 : 0;


                return (
                  <div
                    key={course._id}
                    className="bg-card rounded-lg shadow-md overflow-hidden border border-border hover:shadow-lg transition"
                  >
                    {/* Course Image */}
                    <div className="relative h-48">
                      <img
                        src={course.coverImage || "/placeholder-course.jpg"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Course Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {course.subtitle || course.category}
                      </p>

                      {/* Seat Information */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Seat Usage</span>
                          <span className="text-sm">
                            {assignedSeats} / {totalSeats} used
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full transition-all ${seatUsagePercent >= 90
                              ? "bg-red-500"
                              : seatUsagePercent >= 70
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              }`}
                            style={{ width: `${Math.min(seatUsagePercent, 100)}%` }}
                          />
                        </div>

                        {/* Warning if seats running low */}
                        {remainingSeats <= 2 && remainingSeats > 0 && (
                          <div className="flex items-center gap-1 text-yellow-600 text-xs">
                            <AlertCircle size={12} />
                            <span>Only {remainingSeats} seat{remainingSeats > 1 ? 's' : ''} remaining!</span>
                          </div>
                        )}

                        {remainingSeats <= 0 && (
                          <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                            <AlertCircle size={12} />
                            <span>All seats allocated</span>
                          </div>
                        )}
                      </div>

                      {/* Buy More Seats Section */}
                      {buyingSeats === course._id ? (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Additional Seats</label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={additionalSeats[course._id] || 1}
                              onChange={(e) =>
                                setAdditionalSeats({
                                  ...additionalSeats,
                                  [course._id]: parseInt(e.target.value) || 1,
                                })
                              }
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleBuyMoreSeats(course._id)}
                            >
                              <ShoppingCart size={16} className="mr-1" />
                              Add to Cart
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBuyingSeats(null)}
                            className="w-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBuyingSeats(course._id);
                            setAdditionalSeats({ ...additionalSeats, [course._id]: 1 });
                          }}
                          className="w-full"
                        >
                          <ShoppingCart size={16} className="mr-2" />
                          Buy More Seats
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No courses found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or explore more courses
              </p>
            </div>
          )}
        </div>
      </div>
    </>

  );
};

export default MyCoursesPage;
