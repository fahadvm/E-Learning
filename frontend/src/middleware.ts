import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const hasAuth = token || refreshToken;

    const path = req.nextUrl.pathname;

    // Define public routes (login, signup, etc.)
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

        "/admin/login",
    ];

    // Define home routes for each role
    const roleHomeMap: Record<string, string> = {
        "/student": "/student/home",
        "/teacher": "/teacher/home",
        "/company": "/company/home",
        "/employee": "/employee/home",
        "/admin": "/admin/dashboard",
    };

    // Find which role prefix matches the current path
    const matchedRole = Object.keys(roleHomeMap).find(prefix => path.startsWith(prefix));

    // If user is on a public route (login/signup) AND has auth token
    // → Redirect to their home page
    if (publicRoutes.includes(path) && hasAuth && matchedRole) {
        console.log(`[Middleware] Authenticated user on public route ${path}, redirecting to ${roleHomeMap[matchedRole]}`);
        return NextResponse.redirect(new URL(roleHomeMap[matchedRole], req.url));
    }

    // If user is on a protected route AND has NO auth token
    // → Redirect to login page
    if (!publicRoutes.includes(path) && !hasAuth && matchedRole) {
        console.log(`[Middleware] Unauthenticated user on protected route ${path}, redirecting to ${matchedRole}/login`);
        return NextResponse.redirect(new URL(`${matchedRole}/login`, req.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/student/:path*",
        "/teacher/:path*",
        "/company/:path*",
        "/employee/:path*",
        "/admin/:path*",
    ],
};
