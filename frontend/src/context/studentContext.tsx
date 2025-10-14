'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { StudentApiMethods } from '@/services/APImethods';
import { showErrorToast } from '@/utils/Toast';

export interface SocialLinks {
  linkedin: string;
  twitter: string;
  instagram: string;
}
export interface IcoursesProgress {
  _id:string;
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  percentage:number;
  lastVisitedLesson:string
}


export interface IStudent {
  _id?: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  about: string;
  plans:[]
  profilePicture: string;
  location: string;
  phone: string;
  website: string;
  social_links: SocialLinks;
  name: string;
  email: string;
  password: string;
  courses: string;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
  coursesProgress : IcoursesProgress[]
}

interface StudentContextType {
  student: IStudent | null;
  setStudent: React.Dispatch<React.SetStateAction<IStudent | null>>;
}

const StudentContext = createContext<StudentContextType | null>(null);

export const StudentContextProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<IStudent | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/student/login', '/student/signup', '/student/forgetPassword' , '/student/resetPassword', '/student/verify-forget-otp' , '/student/verify-otp'];
  const isPublicPage = publicPaths.includes(pathname);

  const getStudentDetails = useCallback(async () => {
    try {
      const res = await StudentApiMethods.getStudent();
      if (res?.ok && res.data) {
        setStudent(res.data);
      } else {
        router.push('/student/login');
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      router.push('/student/login');
    }
  }, [router]);

  useEffect(() => {
    if (!isPublicPage) {
      getStudentDetails();
    }
  }, [getStudentDetails, isPublicPage]);

  return (
    <StudentContext.Provider value={{ student, setStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error('useStudent must be used inside StudentContextProvider');
  return context;
};
