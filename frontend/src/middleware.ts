

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value || req.cookies.get("refreshToken")?.value;
    const path = req.nextUrl.pathname;
    
    const publicRoutes = [
        "/student/login",
        "/student/signup",
        "/student/forgetPassword",
        "/student/resetPassword",
        "/student/verify-forget-otp",
        "/student/verify-otp",

        "/teacher/login",
        "/teacher/signup",
        "/teacher/forgetPassword",
        "/teacher/resetPassword",
        "/teacher/verify-forget-otp",
        "/teacher/verify-otp",

        "/employee/login",
        "/employee/signup",
        "/employee/forgetPassword",
        "/employee/resetPassword",
        "/employee/forgetPassword/verify-forget-otp",
        "/employee/signup/verify-otp",

        "/company/login",
        "/company/signup",
        "/company/forgetpassword",
        "/company/resetpassword",
        "/company/verify-forget-otp",
        "/company/verify-otp",
    ];

    const roleRedirectMap: Record<string, string> = {
        "/student": "/student/home",
        "/teacher": "/teacher/home",
        "/company": "/company/home",
        "/employee": "/employee/home",
    };

    const matchedRole = Object.keys(roleRedirectMap).find(prefix => path.startsWith(prefix));

    //  If public route AND token exists → redirect to home
    if (publicRoutes.includes(path) && token && matchedRole) {
        return NextResponse.redirect(new URL(roleRedirectMap[matchedRole], req.url));
    }

    //  If protected route AND no token → redirect to login
    if (!publicRoutes.includes(path) && !token && matchedRole) {
        return NextResponse.redirect(new URL(`${matchedRole}/login`, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/student/:path*",
        "/teacher/:path*",
        "/company/:path*", 
        "/employee/:path*",
    ],
};
