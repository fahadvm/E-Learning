
export interface Education {
    degree: string;
    institution: string;
    from: string;
    to: string;
    description: string;
}

export interface Experience {
    title: string;
    company: string;
    from: string;
    to: string;
    description: string;
}

export interface SocialLinks {
    linkedin: string;
    twitter: string;
    instagram: string;
}

export interface TeacherProfile {
    _id?: string;
    name: string;
    email?: string;
    about: string;
    phone: string;
    location: string;
    website: string;
    social_links: SocialLinks;
    skills: string[];
    education: Education[];
    experiences: Experience[];
    profilePicture: string;
    isVerified?: boolean;
}

export interface ChangePasswordDTO {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}
