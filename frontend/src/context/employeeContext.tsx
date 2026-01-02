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
import { initSocket, disconnectSocket } from '@/lib/socket';

// ---------------------- Interfaces ----------------------

import { EmployeeProfile as IEmployee, SocialLinks, IEmployeeCourseProgress as ICourseProgress } from '@/types/employee/employeeTypes';
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

  useEffect(() => {
    if (employee?._id) {
      initSocket(employee._id);
    }
    return () => {
      disconnectSocket();
    };
  }, [employee?._id]);

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
