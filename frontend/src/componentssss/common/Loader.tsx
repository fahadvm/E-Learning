// components/Loader.tsx

'use client';
import { useLoading } from "../../hooks/useLoading";
import React from "react";

interface LoaderProps {
  size?: number;       // spinner diameter
  color?: string;      // main color
  text?: string;       // optional loading text
}

const Loader: React.FC<LoaderProps> = ({ size = 60, color = "#000000ff", }) => {
  const { isLoading } = useLoading();
  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className="relative w-16 h-16"
        style={{ width: size, height: size }}
      >
        {/* Outer rotating ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-[4px] animate-spin"
          style={{ borderTopColor: color }}
        ></div>

        {/* Inner bouncing circle */}
        <div
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 animate-bounce"
          style={{ backgroundColor: color }}
        ></div>
      </div>

    </div>
  );
};

export default Loader;

