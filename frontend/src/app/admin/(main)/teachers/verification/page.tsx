"use client";

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6">
      <div className="text-center text-white space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Welcome to <span className="text-yellow-300">DevNext</span> 🎉
        </h1>

        <p className="text-lg md:text-xl text-white/90 max-w-lg mx-auto">
          Learn. Grow. Achieve. Explore courses, training programs, and corporate learning paths.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="bg-white text-indigo-700 px-6 py-3 rounded-lg text-lg font-medium shadow hover:bg-yellow-300 hover:text-indigo-700 transition"
          >
            Get Started
          </a>
          <a
            href="/courses"
            className="bg-indigo-800 border border-white/30 px-6 py-3 rounded-lg text-lg font-medium shadow hover:bg-indigo-900 transition"
          >
            Explore Courses
          </a>
        </div>
      </div>
    </div>
  );
}
