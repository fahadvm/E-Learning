import React from "react";
import Header from "@/componentssss/teacher/header";

interface ILesson {
    title: string
    content?: string
    videoUrl?: string
}

interface IModule {
    title: string
    description?: string
    lessons: ILesson[]
}

interface ICourse {
    _id: string
    title: string
    description: string
    level: string
    category: string
    price?: string
    coverImage?: string
    modules: IModule[]
    createdAt?: string
}


export default function HeroSection() {

    return (
        <>
            <Header />



            <div
                className="relative flex items-center justify-center h-screen bg-cover bg-center text-white"
                style={{ backgroundImage: "url('/black-banner.jpg')" }}>
              
                <div className="absolute inset-0 bg-black/50"></div>

              
                <div className="relative z-10 flex flex-col items-start p-8">
                    <h1 className="text-5xl font-bold mb-4">
                        Advance Your Career in a Digitalized World
                    </h1>
                    <p className="mb-6 max-w-2xl">
                        We provide you with unrestricted access to the greatest courses from the
                        top specialists, allowing you to learn countless practical lessons in a
                        range of topics.
                    </p>

                    <div className="flex mb-4">
                        <input
                            type="text"
                            placeholder="Search course, event or author"
                            className="p-3 rounded-l-md bg-white text-gray-900 outline-none w-80"
                        />
                        <button className="p-3 bg-cyan-500 rounded-r-md">
                            Search
                        </button>
                    </div>

                    <div className="text-sm">
                        Popular: <span className="font-medium">UI Design, UX Research, Android, C++</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Course Management</h2>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center">
                            <span>Mathematics 101</span>
                            <button className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600">Edit</button>
                        </li>
                        <li className="flex justify-between items-center">
                            <span>Physics for Beginners</span>
                            <button className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600">Edit</button>
                        </li>
                        <li className="flex justify-between items-center">
                            <span>Advanced Calculus</span>
                            <button className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600">Edit</button>
                        </li>
                    </ul>
                    <button className="mt-4 w-full bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">
                        Create New Course
                    </button>
                </div>

                {/* Student Progress */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="font-medium">John Doe</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-cyan-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <p className="text-sm text-gray-600">75% Complete</p>
                        </div>
                        <div>
                            <p className="font-medium">Jane Smith</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-cyan-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                            <p className="text-sm text-gray-600">90% Complete</p>
                        </div>
                    </div>
                    <button className="mt-4 w-full bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">
                        View All Students
                    </button>
                </div>

                {/* Announcements */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Announcements</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="font-medium">Midterm Exam Schedule</p>
                            <p className="text-sm text-gray-600">Posted: Aug 18, 2025</p>
                        </div>
                        <div>
                            <p className="font-medium">New Assignment Uploaded</p>
                            <p className="text-sm text-gray-600">Posted: Aug 15, 2025</p>
                        </div>
                    </div>
                    <button className="mt-4 w-full bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">
                        Post New Announcement
                    </button>
                </div>

                {/* Schedule */}
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-cyan-100 p-4 rounded-lg">
                            <p className="font-medium">Monday</p>
                            <p className="text-sm">Math 101: 10 AM - 12 PM</p>
                        </div>
                        <div className="bg-cyan-100 p-4 rounded-lg">
                            <p className="font-medium">Tuesday</p>
                            <p className="text-sm">Physics: 1 PM - 3 PM</p>
                        </div>
                        <div className="bg-cyan-100 p-4 rounded-lg">
                            <p className="font-medium">Wednesday</p>
                            <p className="text-sm">Calculus: 9 AM - 11 AM</p>
                        </div>
                        <div className="bg-cyan-100 p-4 rounded-lg">
                            <p className="font-medium">Thursday</p>
                            <p className="text-sm">Office Hours: 2 PM - 4 PM</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

