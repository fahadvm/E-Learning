// components/Loader.tsx

'use client';
import { BookOpen, GraduationCap } from "lucide-react";
import { useLoading } from "../../hooks/useLoading";
import React, { useEffect, useState } from "react";

interface LoaderProps {
  loadingTexts?: string;
}

const Loader: React.FC<LoaderProps> = ({ loadingTexts = "loading", }) => {
  const { isLoading } = useLoading();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);



    return () => {
      clearInterval(progressInterval);
    };
  }, []);
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950 dark:via-blue-900 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8 px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 dark:bg-blue-400/20 rounded-full blur-2xl animate-pulse" />

          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 border-4 border-blue-300 dark:border-blue-700 rounded-full animate-ping opacity-20" />
            <div className="absolute w-28 h-28 border-4 border-t-blue-600 dark:border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />

            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-0 animate-[wiggle_3s_ease-in-out_infinite]">
              <BookOpen className="w-12 h-12 text-white animate-[bounce_2s_ease-in-out_infinite]" />
              <GraduationCap className="absolute w-8 h-8 text-white/80 -top-2 -right-2 animate-[spin_4s_linear_infinite]" />
            </div>
          </div>
        </div>

        <div className="w-80 max-w-md space-y-4">
          <div className="relative h-3 bg-blue-200/50 dark:bg-blue-900/30 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 dark:from-blue-500 dark:via-cyan-400 dark:to-blue-500 rounded-full transition-all duration-300 ease-out shadow-lg shadow-blue-500/50"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-blue-800 dark:text-blue-200 font-medium text-lg animate-[fadeInOut_2s_ease-in-out_infinite]">
              {loadingTexts}
            </p>
            <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
              {progress}%
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-[bounce_1s_ease-in-out_infinite]" />
          <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.2s]" />
          <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.4s]" />
        </div>
      </div>
    </div>
  );
};

export default Loader;

