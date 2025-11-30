export interface ICourse {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription?: string; // assuming you might want to support a separate short one
  category: string;
  coverImage: string;
  price: number;
  level: "Beginner" | "Intermediate" | "Advanced" | string;
  language: string;
  learningOutcomes: string[];
  requirements: string[];
  totalDuration: number;
  totalStudents: number;
  modules: Module[];
  reviewCount:number;
  averageRating :number;
  teacherName:string;
  status: "published" | "draft" | "archived" | string;
  isPublished: boolean;
  isBlocked: boolean;
  isVerified: boolean;
  teacherId: Teacher;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  _id: string;
  title: string;
  duration: string; // e.g. "5:32"
  videoUrl?: string;
  preview: boolean;
}

export interface Teacher {
  _id: string;
  name: string;
  email: string;
  about: string;
  profilePicture: string;
}

export interface Review {
  _id: string;
  name: string;
  comment: string;
  rating: number;
  image?: string;
  date: string;
}
