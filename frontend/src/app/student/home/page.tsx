"use client"

import React from "react";
import Header from "@/components/student/header";
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';



import { useEffect, useState } from "react";
import { Book, Clock, GraduationCap, Star } from "lucide-react";
import axios from "axios";
import { studentCourseApi, studentTeacherApi } from "@/services/APImethods/studentAPImethods";
import { useStudent } from '@/context/studentContext';



export default function HeroSection() {
    interface ICourse {
        _id: string
        title: string
        description: string
        level: string
        category: string
        price?: string
        coverImage?: string
        createdAt?: string
    }

    interface ITeacher {
        _id: string
        name: string
        email: string
        ProfileImage?: string
    }

    const [recommendedCourses, setRecommendedCourses] = useState<ICourse[]>([]);
    const [teachers, setTeachers] = useState<ITeacher[]>([])
    const { student } = useStudent()

    // const fetchCourses = async () => {
    //     try {
    //         const res = await studentCourseApi.getRecommendedCourses();
    //         console.log("Recommended courses response:", res.data);
    //         console.log("res?.data.data:", res)
    //         setRecommendedCourses(res?.data.data)
    //     } catch (error) {
    //         console.error('Failed to fetch courses', error)
    //     }
    // }

    const fetchTeachers = async () => {
        try {

            const res = await studentTeacherApi.getAllTeachers()
            setTeachers(res.data.data)
        } catch (error) {
            console.error('Failed to fetch courses', error)
        }
    }

    // useEffect(() => {
    //     if (student) {
    //         fetchCourses()
    //     }
    // }, []);



    const subjects = [
        { img: '/hero/h1_hero.png', title: 'Programing' },
        { img: '/gallery/topic2.png', title: 'Development' },
        { img: '/gallery/topic3.png', title: 'Database' },
        { img: '/gallery/topic4.png', title: 'Git Hub' },
        { img: '/gallery/topic5.png', title: 'Frontend' },
        { img: '/gallery/topic6.png', title: 'Backend' },
        { img: '/gallery/topic7.png', title: 'Design' },
        { img: '/gallery/topic8.png', title: 'Hosting' },
    ];

    const experts = [
        { img: '/gallery/team1.png', name: 'Mr. Urela', description: 'The automated process all your website tasks.' },
        { img: '/gallery/team2.png', name: 'Mr. Uttom', description: 'The automated process all your website tasks.' },
        { img: '/gallery/team3.png', name: 'Mr. Shakil', description: 'The automated process all your website tasks.' },
        { img: '/gallery/team4.png', name: 'Mr. Arafat', description: 'The automated process all your website tasks.' },
        { img: '/gallery/team3.png', name: 'Mr. Saiful', description: 'The automated process all your website tasks.' },
    ];



    return (
        <>
            <Header />
            <div
                className="relative flex items-center justify-center min-h-[70vh] bg-gray-50 text-white bg-cover bg-center"
                style={{
                    backgroundImage: "url('/hero/h1_hero.png')",
                }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black opacity-50"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-start p-6 md:p-12 max-w-3xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
                        Advance Your Career in a Digitalized World
                    </h1>
                    <p className="mb-6 text-sm sm:text-base md:text-lg text-gray-200">
                        We provide you with unrestricted access to the greatest courses from the top specialists,
                        allowing you to learn countless practical lessons in a range of topics.
                    </p>

                    {/* Search Bar */}
                    <div className="flex w-full max-w-md mb-4">
                        <input
                            type="text"
                            placeholder="Search course, event or author"
                            className="flex-1 p-3 rounded-l-md bg-white text-gray-900 outline-none"
                        />
                        <button className="p-3 bg-indigo-500 rounded-r-md hover:bg-indigo-600 transition">
                            Search
                        </button>
                    </div>

                    <div className="text-xs sm:text-sm">
                        Popular:{" "}
                        <span className="font-medium">
                            UI Design, UX Research, Android, C++
                        </span>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-12">
                <div className="mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Service 1 */}
                        <div className="single-services p-6 border rounded-lg shadow-md text-center bg-white">
                            <div className="features-icon mb-4">
                                <img src="/icon/icon1.svg" alt="UX Courses" className="mx-auto w-12 h-12" />
                            </div>
                            <div className="features-caption">
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">60+ Courses</h3>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    The automated process handles all your website tasks.
                                </p>
                            </div>
                        </div>

                        {/* Service 2 */}
                        <div className="single-services p-6 border rounded-lg shadow-md text-center bg-white">
                            <div className="features-icon mb-4">
                                <img src="/icon/icon2.svg" alt="Expert Instructors" className="mx-auto w-12 h-12" />
                            </div>
                            <div className="features-caption">
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Expert Instructors</h3>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Learn from top industry experts across fields.
                                </p>
                            </div>
                        </div>

                        {/* Service 3 */}
                        <div className="single-services p-6 border rounded-lg shadow-md text-center bg-white">
                            <div className="features-icon mb-4">
                                <img src="/icon/icon3.svg" alt="Lifetime Access" className="mx-auto w-12 h-12" />
                            </div>
                            <div className="features-caption">
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Lifetime Access</h3>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Access courses anytime, anywhere with no limits.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="min-h-screen bg-gray-200 px-6 py-8">
                <section className="py-16 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-indigo-900">Our Featured Courses</h2>
                        </div>

                        {/* Grid of 8 Courses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recommendedCourses?.slice(0, 8).map((course, index) => (
                                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
                                    <div className="relative">
                                        <img src={course.coverImage}
                                            alt={course.title} className="w-full h-48 object-cover" />
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <p className="text-sm text-gray-600">{course.category}</p>
                                        <h3 className="text-xl font-semibold mb-2">
                                            <Link href="#" className="hover:text-blue-600">{course.title.toUpperCase()}</Link>
                                        </h3>
                                        <p className="text-gray-600 mb-4 flex-grow">{course.description}</p>

                                        <div className="flex justify-between items-center mt-auto">
                                            <Link
                                                href={`/student/courses/${course._id}`}
                                                className="inline-block px-4 py-2 border bg-indigo-200 border-gray-300 rounded hover:bg-indigo-400 text-sm"
                                            >
                                                Find out more
                                            </Link>
                                            <div className="text-xl font-bold">₹{course.price}</div>
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>

                        {/* Centered View More Button */}
                        <div className="text-center mt-10">
                            <Link
                                href="/student/courses"
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                View More Courses
                            </Link>
                        </div>
                    </div>
                </section>


                {/* About Area 1 */}
                <section className="py-10">
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-8 md:mb-0">

                            <div className="relative bg-indigo-900 h-36 w-36 rounded-full flex items-center justify-center text-white">
                                <img
                                    src="/icon/about.svg"
                                    alt="About Icon"
                                    className="h-16 absolute top-18 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                />
                            </div>

                            <h2 className="text-3xl font-bold mb-4">Learn new skills online with top educators</h2>
                            <p className="text-gray-600 mb-6">
                                The automated process all your website tasks. Discover tools and techniques to engage effectively with vulnerable children and young people.
                            </p>
                            {[
                                'Techniques to engage effectively with vulnerable children and young people.',
                                'Join millions of people from around the world learning together.',
                                'Join millions of people from around the world learning together. Online learning is as easy and natural.',
                            ].map((text, index) => (
                                <div key={index} className="flex items-center mb-4">
                                    <img src="/icon/right-icon.svg" alt="Feature Icon" className="h-6 mr-4" />
                                    <p className="text-gray-600">{text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="md:w-1/2 relative">
                            <img src="/gallery/about.jpeg" alt="About" className="w-full rounded-lg" />
                            <a
                                href="https://youtu.be/CBKMozshw6E?si=Wm-tQF1tGvkyeEsq  "
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <i className="fas fa-play text-indigo-200 text-3xl  p-4  rounded-full"></i>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Top Subjects Area */}
                <section className="py-16 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold">Explore Top Subjects</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {subjects.map((subject, index) => (
                                <div key={index} className="text-center">
                                    <div className="relative h-48 rounded-lg overflow-hidden">
                                        {/* Image */}
                                        <img
                                            src={subject.img}
                                            alt={subject.title}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Bottom overlay with text */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-indigo-900 bg-opacity-40 p-4 z-10">
                                            <h3 className="text-white text-lg font-semibold">
                                                <Link href="/student/courses">{subject.title}</Link>
                                            </h3>
                                        </div>
                                    </div>



                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link href="/courses" className="inline-block px-6 py-3 border border-gray-300 rounded hover:bg-gray-100">
                                View More...
                            </Link>
                        </div>
                    </div>
                </section>

                {/* About Area 3 */}
                <section className="py-16">
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <img src="/gallery/about3.png" alt="About" className="w-full rounded-lg" />
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold mb-4">Learner outcomes on courses you will take</h2>
                            {[
                                'Techniques to engage effectively with vulnerable children and young people.',
                                'Join millions of people from around the world learning together.',
                                'Join millions of people from around the world learning together. Online learning is as easy and natural.',
                            ].map((text, index) => (
                                <div key={index} className="flex items-center mb-4">
                                    <img src="/icon/right-icon.svg" alt="Feature Icon" className="h-6 mr-4" />
                                    <p className="text-gray-600">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Area */}
                <section className="py-16 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold">Expert instructors</h2>
                        </div>
                        <Swiper
                            spaceBetween={30}
                            slidesPerView={3}
                            loop={true}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            navigation={true}
                            modules={[Autoplay, Navigation]}
                            className="px-4"
                        >
                            {experts.map((expert, index) => (
                                <SwiperSlide key={index}>
                                    <div className="text-center px-4">
                                        <img
                                            src={expert.img}
                                            alt={expert.name}
                                            className="w-48 h-48 object-cover rounded-full mx-auto mb-4 shadow-md"
                                        />
                                        <h5 className="text-lg font-semibold">
                                            <Link href="/services">{expert.name}</Link>
                                        </h5>
                                        <p className="text-gray-600 text-sm">{expert.description}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>

                {/* About Area 2 */}
                <section className="py-16">
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <img src="/gallery/about2.png" alt="About" className="w-full rounded-lg" />
                        </div>
                        <div className="md:w-1/2 ml-10">
                            <h2 className="text-5xl font-bold mb-4 text-indigo-900">
                                Take the next step toward your personal and professional goals with us.
                            </h2>
                            <p className="text-gray-600 mb-6">
                                The automated process all your website tasks. Discover tools and techniques to engage effectively with vulnerable children and young people.
                            </p>
                            <Link href="#" className="inline-block px-6 py-3 bg-indigo-900 text-white rounded hover:bg-indigo-700">
                                Try premium Pack
                            </Link>
                        </div>
                    </div>
                </section>


            </div>
        </>
    );
};

