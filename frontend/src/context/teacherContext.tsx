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
import { TeacherApiMethods } from '@/services/APImethods';
import { initSocket, disconnectSocket } from '@/lib/socket';

export interface Education {
  degree: string;
  description: string;
  from: string;
  to: string;
  institution: string;
}

export interface Experience {
  company: string;
  title: string;
  type: string;
  location: string;
  from: string;
  to: string;
  duration: string;
  description: string;
}

export interface SocialLinks {
  linkedin: string;
  twitter: string;
  instagram: string;
}

export interface ITeacher {
  _id: string;
  userId: string;
  name: string;
  email: string;
  verificationStatus: string;
  isBlocked: boolean;
  role: string;
  googleId?: string;
  googleUser: boolean;
  about: string;
  profilePicture: string;
  location: string;
  phone: string;
  website: string;
  social_links: SocialLinks;
  education: Education[];
  experiences: Experience[];
  skills: string[];
  review?: string;
  comment?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

interface TeacherContextType {
  teacher: ITeacher | null;
  setTeacher: React.Dispatch<React.SetStateAction<ITeacher | null>>;
}

const TeacherContext = createContext<TeacherContextType | null>(null);

export const TeacherContextProvider = ({ children }: { children: ReactNode }) => {
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/teacher/login', '/teacher/signup', '/teacher/forgetPassword', '/teacher/resetPassword', '/teacher/verify-forget-otp', '/teacher/verify-otp'];
  const isPublicPage = publicPaths.includes(pathname);


  const getTeacherDetails = useCallback(async () => {
    try {
      const res = await TeacherApiMethods.getTeacher();
      if (res?.ok && res.data) {
        setTeacher(res.data);
      } else {
        router.push('/teacher/login');
      }
    } catch (error) {
      console.error('Error fetching teacher:', error);
      router.push('/teacher/login');
    }
  }, [router]);

  useEffect(() => {
    if (!isPublicPage) {
      getTeacherDetails();
    }
  }, [getTeacherDetails, isPublicPage]);

  useEffect(() => {
    if (teacher?._id) {
      initSocket(teacher._id);
    }
    return () => {
      disconnectSocket();
    };
  }, [teacher?._id]);

  return (
    <TeacherContext.Provider value={{ teacher, setTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) throw new Error('useTeacher must be used inside TeacherContextProvider');
  return context;
};
