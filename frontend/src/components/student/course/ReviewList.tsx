'use client';

import { X, Star } from "lucide-react";

interface ReviewListModalProps {
  open: boolean;
  onClose: () => void;
  reviews: {
    _id: string;
    rating: number;
    comment: string;
    createdAt: string;
    studentId?: { name: string; profilePicture?: string };
    employeeId?: { name: string; profilePicture?: string };
  }[];
}

export default function ReviewListModal({ open, onClose, reviews }: ReviewListModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl p-6 shadow-lg relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">
          All Reviews
        </h2>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">

          {reviews.length === 0 && (
            <p className="text-gray-500">No reviews yet.</p>
          )}

          {reviews.map((review) => {
            const user = review.employeeId || review.studentId;
            return (
              <div
                key={review._id}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >

                {/* User */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden text-[10px] flex items-center justify-center">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        className="w-full h-full object-cover"
                        alt={user.name}
                      />
                    ) : (
                      <span className="text-gray-500">{user?.name?.charAt(0)}</span>
                    )}
                  </div>

                  <div>
                    <p className="font-medium">{user?.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={`${star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                        }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {review.comment}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
