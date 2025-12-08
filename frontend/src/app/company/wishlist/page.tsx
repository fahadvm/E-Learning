"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/company/Header";
import { companyApiMethods } from "@/services/APIservices/companyApiService";

interface Course {
  _id: string;
  title: string;
  price: number;
  coverImage: string;
  instructor?: string;
}

const WishlistCourseCard: React.FC<{
  course: Course;
  onRemove: (courseId: string) => void;
  addcart: (courseId: string) => void;
}> = ({ course, onRemove ,addcart}) => (
  <div className="flex items-center bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
    <img
      src={course.coverImage}
      alt={course.title}
      className="w-24 h-24 object-cover rounded-md mr-4"
    />
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
      {course.instructor && (
        <p className="text-gray-600 text-sm">By {course.instructor}</p>
      )}
      <p className="text-gray-800 font-medium mt-1">
        ₹{course.price || "Free"}
      </p>
    </div>
    <div className="flex space-x-4">
      <button
       onClick={() => addcart(course._id)}
       className="text-blue-500 hover:text-blue-600 font-medium">
        Move to Cart
      </button>
      <button
        onClick={() => onRemove(course._id)}
        className="text-red-500 hover:text-red-600 font-medium"
      >
        Remove
      </button>
    </div>
  </div>
);

const WishlistPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await companyApiMethods.getWishlist()
        setCourses(res.data?.courses || []);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (courseId: string) => {
    try {
      await companyApiMethods.removeWishlist(courseId)
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      console.error("Failed to remove course:", err);
    }
  };
  const handleAddToCart = async (courseId: string) => {
    try {
      await companyApiMethods.addToCart({courseId})
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      console.error("Failed to remove course:", err);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Your Wishlist
        </h1>

        {courses.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            {courses.map((course) => (
              <WishlistCourseCard
                key={course._id}
                course={course}
                onRemove={handleRemove}
                addcart={handleAddToCart}
              />
            ))}
            <div className="mt-8 text-center">
              <Link
                href="/company/courses"
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Looks like you haven’t added any courses yet. Explore our courses
              and save your favorites!
            </p>
            <Link
              href="/company/courses"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
