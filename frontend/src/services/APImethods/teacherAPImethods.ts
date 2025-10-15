import axios from "axios"
import { deleteRequest, getRequest, patchRequest, postRequest } from "../api"
import { baseURL } from "../AxiosInstance"

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const del = deleteRequest;


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
    sendVerificationRequest: (data:any) => post("/teacher/profile/verify",data),
};

export const teacherCourseApi = {
    getMyCourses: (params?: Record<string, any>) => get("/teacher/courses/", params),
    getCourseDetailById: (courseId: string) => get(`/teacher/courses/${courseId}`),
    addCourse: (data: FormData) => post("/teacher/courses/", data),
    updateCourse: (courseId: string, data: any) => patch(`/teacher/courses/${courseId}`, data),

    uploadCourseResource: (courseId: string, data: any) => post(`/teacher/courses/${courseId}/resources`, data),
    fetchCourseResources: (courseId: string) => get(`/teacher/courses/${courseId}/resources`),
    deleteCourseResource: (resourceId:string) => del(`/teacher/courses/${resourceId}/resources`),
};

export const teacherAvailabilityApi = {
    getAvailability: async () => get(`/teacher/availability`),
    saveAvailability: async (data: any) => post("/teacher/availability", data),

}

export const teacherCallRequestApi = {
    getslotsList: async () => get(`/teacher/call-request`),
    getPendingRequests: async () => get(`/teacher/call-request/pending`),
    getConfirmedRequests: async () => get(`/teacher/call-request/confirmed`),
    getRequestDetails: async (bookingId: string) => get(`/teacher/call-request/${bookingId}`),
    approveRequests: async (bookingId: string) => patch(`/teacher/call-request/${bookingId}/approve`, { status: "approved" }),
    rejectRequests: async (bookingId: string, data: { status: string, reason: string }) => patch(`/teacher/call-request/${bookingId}/reject`, data),
    tester: async (userId : string) => get(`/teacher/call-request/notifications/testing/${userId}`),
    testerMark: async (data :{notificationId : string}) => post(`/teacher/call-request/notifications/testing/markread`,data),
}


export const teacherChatApi = {
  getmessages: (chatId: string) => get(`/teacher/chat/messages/${chatId}`),
  getChatInfo: (chatId: string) => get(`/teacher/chat/${chatId}`),
  getuserchat: () => get(`/teacher/chat`),

};


export const teacherNotificationApi = {
    getNotifications: (userId: string) =>{ console.log("userId in fetching of getnotifications") ,get(`/shared/notification/${userId}`)},
    markAsRead: (userId: string) =>{ console.log("userId in fetching of getnotifications") ,get(`/shared/notification/${userId}`)},
}





