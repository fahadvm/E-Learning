'use client';

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  size?: number;
}

export default function StarRating({ rating, onChange, size = 28 }: StarRatingProps) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`cursor-pointer transition ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
}
