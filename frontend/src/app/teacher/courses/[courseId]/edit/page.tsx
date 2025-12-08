"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/teacher/header";
import ProgressSteps from "@/components/teacher/course/addCourse/ProgressSteps";
import BasicInformation from "@/components/teacher/course/addCourse/BasicInformation";
import Curriculum from "@/components/teacher/course/addCourse/Curriculum";
import PricingSettings from "@/components/teacher/course/addCourse/PricingSettings";
import ReviewPublish from "@/components/teacher/course/addCourse/ReviewPublish";
import Navigation from "@/components/teacher/course/addCourse/Navigation";
import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { teacherCourseApi } from "@/services/APIservices/teacherApiService";

// --- Types reuse ---
type CourseLesson = {
    id: string;
    title: string;
    description: string;
    type: "video";
    duration: number;
    isFree: boolean;
    videoFile: File | string | null; // Allow string for existing URL
    thumbnail: File | string | null; // Allow string for existing URL
};

type CourseModule = {
    id: string;
    title: string;
    description: string;
    lessons: CourseLesson[];
};

type CourseData = {
    title: string;
    subtitle: string;
    description: string;
    category: string;
    level: string;
    language: string;
    price: number;
    isTechnicalCourse: boolean;
    currency: string;
    coverImage: File | string | null;  // Allow string for existing URL
    tags: string[];
    learningOutcomes: string[];
    requirements: string[];
    isPublished: boolean;
    allowDiscounts: boolean;
    totalDuration: number;
};

const steps = [
    { number: 1, title: "Basic Information", description: "Course details and metadata" },
    { number: 2, title: "Curriculum", description: "Structure your course content" },
    { number: 3, title: "Pricing & Settings", description: "Set price and publish options" },
    { number: 4, title: "Review & Publish", description: "Review and publish your course" },
];

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params?.courseId as string;

    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [courseData, setCourseData] = useState<CourseData>({
        title: "",
        subtitle: "",
        description: "",
        category: "",
        level: "Beginner",
        language: "English",
        price: 0,
        currency: "INR",
        isTechnicalCourse: false,
        coverImage: null,
        tags: [],
        learningOutcomes: [""],
        requirements: [""],
        isPublished: false,
        allowDiscounts: true,
        totalDuration: 0,
    });

    const [modules, setModules] = useState<CourseModule[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch course data
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await teacherCourseApi.getCourseDetailById(courseId);
                if (res.data) {
                    const course = res.data;

                    setCourseData({
                        title: course.title,
                        subtitle: course.subtitle || "",
                        description: course.description,
                        category: course.category,
                        level: course.level,
                        language: course.language,
                        price: course.price || 0,
                        currency: "INR", // Assuming default or fetch from BE if stored
                        isTechnicalCourse: course.isTechnicalCourse || false,
                        coverImage: course.coverImage, // URL
                        tags: course.tags || [],
                        learningOutcomes: course.learningOutcomes?.length ? course.learningOutcomes : [""],
                        requirements: course.requirements?.length ? course.requirements : [""],
                        isPublished: course.isPublished,
                        allowDiscounts: true, // Assuming default
                        totalDuration: course.totalDuration || 0,
                    });

                    // Transform modules
                    const transformModules = (course.modules || []).map((mod: any, i: number) => ({
                        id: mod._id || `temp-mod-${i}`,
                        title: mod.title,
                        description: mod.description,
                        lessons: (mod.lessons || []).map((les: any, j: number) => ({
                            id: les._id || `temp-les-${i}-${j}`,
                            title: les.title,
                            description: les.description,
                            type: "video",
                            duration: les.duration,
                            videoFile: les.videoFile, // URL
                            thumbnail: les.thumbnail, // URL
                        }))
                    }));
                    setModules(transformModules);
                }
            } catch (error) {
                showErrorToast("Failed to fetch course details");
                router.push("/teacher/courses");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const getTotalDuration = () => {
        return modules.reduce(
            (total, module) =>
                total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + (lesson.duration || 0), 0),
            0
        );
    };

    const getTotalLessons = () => {
        return modules.reduce((total, module) => total + module.lessons.length, 0);
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return !!(courseData.title && courseData.description && courseData.category);
            case 2: {
                // Validation logic - can be relaxed for editing if needed, but keeping strict for consistency
                /* 
                   If reusing logic from create page:
                   if (modules.length !== 7) ...
                */
                return true;
            }
            case 3:
                return courseData.price >= 0;
            case 4:
                return true;
            default:
                return false;
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", courseData.title);
            formData.append("subtitle", courseData.subtitle || "");
            formData.append("description", courseData.description);
            formData.append("category", courseData.category);
            formData.append("isTechnicalCourse", String(courseData.isTechnicalCourse));
            formData.append("level", courseData.level);
            formData.append("totalDuration", getTotalDuration().toString());
            formData.append("language", courseData.language);
            formData.append("price", courseData.price.toString());
            formData.append("isPublished", String(courseData.isPublished));
            formData.append("learningOutcomes", JSON.stringify(courseData.learningOutcomes.filter((o) => o.trim())));
            formData.append("requirements", JSON.stringify(courseData.requirements.filter((r) => r.trim())));

            // Modules
            // We pass modules as a JSON string for structure
            // But we also need to handle new file uploads. 
            // The service expects `modules` JSON + specific fields for files

            // Remove file objects from modules JSON before appending, to avoid circular reference issues or huge payloads
            // The keys in JSON will help backend map files
            const modulesForJson = modules.map(m => ({
                title: m.title,
                description: m.description,
                lessons: m.lessons.map(l => ({
                    title: l.title,
                    description: l.description,
                    duration: l.duration,
                    // If it's a string (URL), pass it. If it's a File, pass it as empty string or placeholder? 
                    // The service checks `req.files` map.
                    // Actually, Service logic:
                    // let videoFileUrl = lesson.videoFile || ''; // retain existing if string
                    // ... checks filesMap
                    videoFile: typeof l.videoFile === 'string' ? l.videoFile : undefined,
                    thumbnail: typeof l.thumbnail === 'string' ? l.thumbnail : undefined,
                }))
            }));

            formData.append("modules", JSON.stringify(modulesForJson));

            if (courseData.coverImage instanceof File) {
                formData.append("coverImage", courseData.coverImage);
            }

            modules.forEach((module, moduleIndex) => {
                module.lessons.forEach((lesson, lessonIndex) => {
                    if (lesson.videoFile instanceof File) {
                        formData.append(`modules[${moduleIndex}][lessons][${lessonIndex}][videoFile]`, lesson.videoFile);
                    }
                    if (lesson.thumbnail instanceof File) {
                        formData.append(`modules[${moduleIndex}][lessons][${lessonIndex}][thumbnail]`, lesson.thumbnail);
                    }
                });
            });

            const res = await teacherCourseApi.editCourse(courseId, formData);
            if ((res as any).ok) {
                showSuccessToast("Course updated successfully!");
                router.push("/teacher/courses");
            } else {
                showErrorToast("Failed to update course");
            }
        } catch (error: any) {
            showErrorToast(error?.response?.data?.message || "Error updating course");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Course</h1>
                            <p className="text-muted-foreground">
                                Step {currentStep} of 4: {steps[currentStep - 1].title}
                            </p>
                        </div>
                    </div>
                </div>

                <ProgressSteps currentStep={currentStep} steps={steps} />

                <div className="mb-8">
                    {currentStep === 1 && (
                        <BasicInformation courseData={courseData as any} setCourseData={setCourseData as any} />
                    )}
                    {currentStep === 2 && (
                        <Curriculum modules={modules as any} setModules={setModules as any} />
                    )}
                    {currentStep === 3 && (
                        <PricingSettings
                            courseData={courseData as any}
                            setCourseData={setCourseData as any}
                            totalDuration={getTotalDuration()}
                            totalLessons={getTotalLessons()}
                        />
                    )}
                    {currentStep === 4 && (
                        <ReviewPublish
                            courseData={courseData as any}
                            modules={modules as any}
                            totalDuration={getTotalDuration()}
                            totalLessons={getTotalLessons()}
                        />
                    )}
                </div>

                <Navigation
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    canProceed={canProceed}
                    isSubmitting={isSubmitting}
                    handleSubmit={handleSubmit}
                    isPublished={courseData.isPublished}
                    steps={steps}
                />
            </div>
        </div>
    );
}
