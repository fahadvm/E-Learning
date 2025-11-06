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
import { employeeApiMethods } from '@/services/APIservices/employeeApiService';

// ---------------------- Interfaces ----------------------

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface ICourseProgress {
  _id?: string;
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  percentage: number;
  lastVisitedLesson?: string;
  notes?: string;
}

export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  companyId: string;
  requestedCompanyId?: string;
  password?: string;
  profilePicture?: string;
  coursesAssigned: string[];
  position?: string;
  isBlocked: boolean;
  status: string;
  role: string;
  isVerified: boolean;
  subscription: boolean;
  googleId?: string;
  about?: string;
  phone?: string;
  social_links?: SocialLinks;
  coursesProgress: ICourseProgress[];
  createdAt?: Date;
  updatedAt?: Date;
  streakCount:  number;
  lastLoginDate: Date;
  longestStreak: number;
}
// ---------------------- Context Type ----------------------

interface EmployeeContextType {
  employee: IEmployee | null;
  setEmployee: React.Dispatch<React.SetStateAction<IEmployee | null>>;
}

// ---------------------- Context Creation ----------------------

const EmployeeContext = createContext<EmployeeContextType | null>(null);

// ---------------------- Provider ----------------------

export const EmployeeContextProvider = ({ children }: { children: ReactNode }) => {
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Public paths that don't require auth
  const publicPaths = [
    '/employee/login',
    '/employee/signup',
    '/employee/forgetPassword',
    '/employee/resetPassword',
    '/employee/verify-forget-otp',
    '/employee/verify-otp',
  ];
  const isPublicPage = publicPaths.includes(pathname);

  // Fetch logged-in employee details
  const getEmployeeDetails = useCallback(async () => {
    try {
      const res = await employeeApiMethods.getProfile();
      if (res?.ok && res.data) {
        setEmployee(res.data);
      } else {
        router.push('/employee/login');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      router.push('/employee/login');
    }
  }, [router]);

  // Auto-fetch on non-public pages
  useEffect(() => {
    if (!isPublicPage) {
      getEmployeeDetails();
    }
  }, [getEmployeeDetails, isPublicPage]);

  return (
    <EmployeeContext.Provider value={{ employee, setEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

// ---------------------- Custom Hook ----------------------

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context)
    throw new Error('useEmployee must be used inside EmployeeContextProvider');
  return context;
};
