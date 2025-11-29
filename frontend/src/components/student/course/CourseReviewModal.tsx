'use client';

import { X } from "lucide-react";
import StarRating from "./StarRating";
import { useState } from "react";

interface CourseReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  initialRating?: number;
  initialComment?: string;
}

export default function CourseReviewModal({
  open,
  onClose,
  onSubmit,
  initialRating = 0,
  initialComment = "",
}: CourseReviewModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (rating === 0) return alert("Please select a rating");

    setLoading(true);
    await onSubmit(rating, comment);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl p-6 shadow-lg relative animate-fadeIn">
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Write a Review
        </h2>

        {/* Rating */}
        <StarRating rating={rating} onChange={setRating} />

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full h-32 mt-4 p-3 rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg w-full font-semibold transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
