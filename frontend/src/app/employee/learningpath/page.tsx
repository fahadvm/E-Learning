'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';


const courses = [
    {
        id: 1,
        title: 'HTML & CSS Basics',
        description: 'Build your first website with colors and magic!',
        duration: '2 weeks',
        difficulty: 'Beginner',
        icon: '🎨',
        completed: true,
        locked: false,
    },
    {
        id: 2,
        title: 'JavaScript Adventures',
        description: 'Make things move and talk with code!',
        duration: '3 weeks',
        difficulty: 'Beginner',
        icon: '⚡',
        completed: true,
        locked: false,
    },
    {
        id: 3,
        title: 'React Rocket',
        description: 'Launch interactive apps into space!',
        duration: '4 weeks',
        difficulty: 'Intermediate',
        icon: '🚀',
        completed: false,
        locked: false,
    },
    {
        id: 4,
        title: 'Node.js Ninja',
        description: 'Master the backend like a shadow warrior.',
        duration: '5 weeks',
        difficulty: 'Intermediate',
        icon: '🥷',
        completed: false,
        locked: true,
    },
    {
        id: 5,
        title: 'Full-Stack Hero',
        description: 'Become a legendary developer!',
        duration: '6 weeks',
        difficulty: 'Advanced',
        icon: '🦸',
        completed: false,
        locked: true,
    },
];




interface Course {
    id: number;
    title: string;
    description: string;
    duration: string;
    difficulty: string;
    icon: string;
    completed: boolean;
    locked: boolean;
}

interface CourseCardProps {
    course: Course;
    isSelected: boolean;
    onClick: () => void;
}

interface ProgressBarProps {
    progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden border-2 border-purple-300">
            <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-4"
                style={{ width: `${progress}%` }}
            >
                <span className="text-white font-bold text-lg drop-shadow-md">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
}

export function CourseCard({ course, isSelected, onClick }: CourseCardProps) {
    return (
        <div
            onClick={onClick}
            className={`relative p-1 rounded-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer
        ${course.locked ? 'opacity-60 grayscale' : ''}
        ${isSelected ? 'ring-4 ring-yellow-400 ring-offset-4' : ''}
      `}
        >
            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-300 hover:border-pink-400 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">{course.icon}</div>
                    {course.completed && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                            ✓ Done!
                        </div>
                    )}
                    {course.locked && (
                        <div className="bg-gray-400 text-white p-2 rounded-full">
                            <Lock className="w-5 h-5" />
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-purple-800 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>

                <div className="flex justify-between items-center text-sm">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                        ⏰ {course.duration}
                    </span>
                    <span className={`px-3 py-1 rounded-full font-medium
            ${course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            course.difficulty === 'Intermediate' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'}
          `}>
                        {course.difficulty}
                    </span>
                </div>

                {course.locked && (
                    <p className="text-center text-gray-500 mt-4 text-sm">🔒 Complete previous levels!</p>
                )}
            </div>
        </div>
    );
}

export default function LearningPath() {
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const completedCount = courses.filter(c => c.completed).length;
    const progress = (completedCount / courses.length) * 100;

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                    Your Coding Quest 🗺️
                </h1>
                <p className="text-xl text-gray-700">Embark on an epic journey to become a developer!</p>
            </div>

            {/* Progress */}
            <div className="mb-16 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-purple-200">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-2xl font-bold text-purple-800">Adventure Progress</h2>
                    <span className="text-3xl">{completedCount}/{courses.length} 🏆</span>
                </div>
                <ProgressBar progress={progress} />
            </div>

            {/* Course Path */}
            <div className="relative">
                {/* Decorative Path Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-purple-400 via-pink-400 to-yellow-400 rounded-full hidden md:block" />

                <div className="space-y-16 md:space-y-24">
                    {courses.map((course, index) => (
                        <div
                            key={course.id}
                            className={`relative flex justify-center md:justify-${index % 2 === 0 ? 'start' : 'end'
                                } items-center`}
                        >
                            {/* Connector Dot */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-4 border-purple-500 shadow-lg z-10 hidden md:block" />

                            <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                <CourseCard
                                    course={course}
                                    isSelected={selectedCourse === course.id}
                                    onClick={() => !course.locked && setSelectedCourse(course.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Celebration */}
            {progress === 100 && (
                <div className="mt-20 text-center">
                    <div className="inline-block animate-bounce">
                        <span className="text-6xl">🎉</span>
                    </div>
                    <h2 className="text-4xl font-bold text-purple-700 mt-4">You Completed the Quest!</h2>
                </div>
            )}
        </div>
    );
}