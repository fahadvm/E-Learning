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
import { adminApiMethods } from '@/services/APIservices/adminApiService';
import { initSocket } from '@/lib/socket';

/* ------------ Admin Interface ------------ */
export interface IAdmin {
  _id?: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  isSuperAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AdminContextType {
  admin: IAdmin | null;
  setAdmin: React.Dispatch<React.SetStateAction<IAdmin | null>>;
}

const AdminContext = createContext<AdminContextType | null>(null);

/* ------------ Provider ------------ */
export const AdminContextProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<IAdmin | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  /* ------------ Public Admin Routes ------------ */
  const publicPaths = [
    '/admin/login',
    '/admin/forgot-password',
    '/admin/reset-password',
    '/admin/verify-otp',
  ];
  const isPublicPage = publicPaths.includes(pathname);

  /* ------------ Fetch Admin Details ------------ */
  const getAdminDetails = useCallback(async () => {
    try {
      const res = await adminApiMethods.getProfile();
      if (res?.ok && res.data) {
        setAdmin(res.data);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching admin:', error);
      router.push('/admin/login');
    }
  }, [router]);

  /* ------------ Auth Guard ------------ */
  useEffect(() => {
    if (!isPublicPage) {
      getAdminDetails();
    }
  }, [getAdminDetails, isPublicPage]);

  /* ------------ Socket Init (Optional) ------------ */
  useEffect(() => {
    if (admin?._id) {
      initSocket(
        admin._id,
        () => { },
        () => { },
        () => { },
        () => { },
        () => { },
        () => { }
      );
    }
  }, [admin?._id]);

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

/* ------------ Hook ------------ */
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used inside AdminContextProvider');
  return context;
};
