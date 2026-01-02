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
import { initSocket } from '@/lib/socket';
import { Socket } from 'socket.io-client';

interface NotificationType {
  title: string;
  message: string;
  createdAt: Date;
  isRead?: boolean;
}

export interface IStudent {
  _id?: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  about: string;
  plans: unknown[];
  profilePicture: string;
  location: string;
  phone: string;
  website: string;
  social_links: {
    linkedin: string;
    gitHub: string;
    leetCode: string;
  };
  name: string;
  email: string;
  password: string;
  courses: string;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
  coursesProgress: { courseId: string; progress: number }[];
}

interface StudentContextType {
  student: IStudent | null;
  setStudent: React.Dispatch<React.SetStateAction<IStudent | null>>;
  socket: Socket | null;
  notifications: NotificationType[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
}

const StudentContext = createContext<StudentContextType | null>(null);

export const StudentContextProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<IStudent | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const router = useRouter();
  const pathname = usePathname();

  // Public Routes (No Protection)
  const publicPaths = [
    '/student/login',
    '/student/signup',
    '/student/forgetPassword',
    '/student/resetPassword',
    '/student/verify-forget-otp',
    '/student/verify-otp'
  ];
  const isPublicPage = publicPaths.includes(pathname);

  /* ------------------------------------------------------------
      FETCH STUDENT DETAILS
  ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
      SOCKET INITIALIZATION (ONLY ONCE)
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!student?._id) return;

    const s = initSocket(
      student._id,
      (msg) => console.log("Message received: ", msg),
      () => { },
      () => { },
      () => { },
      () => { },
      () => { }
    );

    setSocket(s);

    return () => {
      s?.disconnect();
      setSocket(null);
    };
  }, [student?._id]);

  return (
    <StudentContext.Provider
      value={{
        student,
        setStudent,
        socket,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error('useStudent must be used inside StudentContextProvider');
  return context;
};
