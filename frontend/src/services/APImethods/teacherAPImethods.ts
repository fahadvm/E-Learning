import axios from "axios"
import { getRequest, patchRequest, postRequest } from "../api"
import { baseURL } from "../AxiosInstance"

const get = getRequest;
const post = postRequest;
const patch = patchRequest;


export const teacherAuthApi = {
    signup: (data: { name: string; email: string; password: string }) => post("/teacher/auth/signup", data),
    login: (data: { email: string; password: string }) => post("/teacher/auth/login", data),
    logout: () => post("/teacher/auth/logout", {}),
    verifyOtp: (data: { email: string; otp: string }) => post("/teacher/auth/verify-otp", data),
    resendOtp: (data: { email: string }) => post("/teacher/auth/resend-otp", data),
    forgotPassword: (data: { email: string }) => post("/teacher/auth/forgot-password", data),
    verifyForgotOtp: (data: { email: string; otp: string }) => post("/teacher/auth/verify-forgot-otp", data),
    setNewPassword: (data: { email: string; newPassword: string }) => post("/teacher/auth/reset-password", data),

};

export const teacherProfileApi = {
    getProfile: () => get("/teacher/profile/"),
    createProfile: (data: any) => post("/teacher/profile/", data),
    editProfile: (data: any) => patch("/teacher/profile/", data),
};

export const teacherCourseApi = {
    getMyCourses: (params?: Record<string, any>) => get("/teacher/courses/", params),
    getCourseDetailById: (courseId: string) => get(`/teacher/courses/${courseId}`),
    addCourse: (data: FormData) => post("/teacher/courses/", data),
    updateCourse: (courseId: string, data: any) => patch(`/teacher/courses/${courseId}`, data),
};

export const teacherAvailabilityApi = {
    getAvailability: async () =>get(`/teacher/availability`),
    saveAvailability: async (data: any) => post("/teacher/availability", data),

}
