'use client';

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';
import { useRouter ,usePathname} from 'next/navigation';
import { CompanyApiMethods } from '@/services/APImethods'; 

// Types
export interface SocialLinks {
    linkedin: string;
    twitter: string;
    instagram: string;
}

export interface IEmployee {
    _id: string;
    name: string;
    email: string;
    position: string;
    isBlocked: boolean;
}

export interface ICompany {
    _id?: string;
    isVerified: boolean;
    isBlocked: boolean;
    role: string;
    about: string;
    profilePicture: string;
    location: string;
    phone: string;
    website: string;
    social_links: SocialLinks;
    name: string;
    email: string;
    password: string;
    courses:string
    employees: IEmployee[];
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface CompanyContextType {
    company: ICompany | null;
    setCompany: React.Dispatch<React.SetStateAction<ICompany | null>>;
}

// Context
const CompanyContext = createContext<CompanyContextType | null>(null);

// Provider
export const CompanyContextProvider = ({ children }: { children: ReactNode }) => {
    const [company, setCompany] = useState<ICompany | null>(null);
    const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/company/login', '/company/signup', '/company/forgetpassword' , '/company/resetpassword', '/company/verify-forget-otp' , '/company/verify-otp'];
  const isPublicPage = publicPaths.includes(pathname);





    const getCompanyDetails = useCallback(async () => {
        try {
            const res = await CompanyApiMethods.getCompany();
            console.log("res from ",res)
            if (res?.ok && res.data) {
                setCompany(res.data);
            } else {
                router.push('/company/login');
            }
        } catch (error) {
            console.error('Error fetching company:', error);
            router.push('/company/login');
        }
    }, [router]);

     useEffect(() => {
    if (!isPublicPage) {
      getCompanyDetails();
    }
  }, [getCompanyDetails, isPublicPage]);

    return (
        <CompanyContext.Provider value={{ company, setCompany }}>
            {children}
        </CompanyContext.Provider>
    );
};



export const useCompany = () => {
    const context = useContext(CompanyContext);
    if (!context) throw new Error('useCompany must be used inside CompanyContextProvider');
    return context;
};
