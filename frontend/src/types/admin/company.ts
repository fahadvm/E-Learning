export interface ICompany {
    _id: string;
    name: string;
    email: string;
    logo?: string;
    industry: string;
    isBlocked: string;
    activePlan: string;
    employees: string[];
}

export interface ICompanyListResponse {
    data: {
        companies: ICompany[];
        total: number;
        totalPages: number;
    }
}


export interface ICompanyDetails {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profilePicture?: string;
    industry: string;

    status: "active" | "blocked";

    joinDate: string;
    activePlan: string;
    subscriptionPlan: string;
    subscriptionStatus: "active" | "expired";
    subscriptionExpiry: string;

    credits: {
        subscription: number;
        course: number;
    };
}

export interface ICompanyEmployee {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    isBlocked: boolean

    coursesCompleted: number;
    coursesAssigned: number;

    creditsUsed: number;
    lastActive: string;

    companyId: string;
}

export interface ICompanyVerification {
    _id: string;
    name: string;
    email: string;
    logo?: string;
    industry: string;

    verificationStatus: "pending" | "verified" | "rejected";
    documentUrl: string;

    createdAt: string;
}

export interface ICompanyVerificationResponse {
    data: ICompanyVerification[];
    total: number;
    totalPages: number;
}

export interface ICompanyCourse {
    _id: string;
    title: string;
    seatsPurchased: number;
    seatsUsed: number;
}
