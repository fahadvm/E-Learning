
export type CourseLesson = {
    id: string;
    title: string;
    description: string;
    type: "video";
    duration: number;
    isFree: boolean;
    videoFile: File | string | null;
    thumbnail: File | string | null;
};

export type CourseModule = {
    id: string;
    title: string;
    description: string;
    lessons: CourseLesson[];
};

export type CourseData = {
    title: string;
    subtitle: string;
    description: string;
    category: string;
    level: string;
    language: string;
    price: number;
    currency: string;
    isTechnicalCourse: boolean;
    coverImage: File | string | null;
    tags: string[];
    learningOutcomes: string[];
    requirements: string[];
    isPublished: boolean;
    allowDiscounts: boolean;
    totalDuration: number;
};
