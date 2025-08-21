import axios from "axios"
import { getRequest, patchRequest, postRequest, putRequest } from "../api"
import { baseURL } from "../AxiosInstance"

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest

export const studentAuthApi = {
  login: (data: { email: string; password: string }) => post('/student/auth/login', data),
  signup: (data: { name: string; email: string; password: string }) => post('/student/auth/signup', data),
  verifyOtp: (data: { email: string; otp: string }) => post('/student/auth/verify-otp', data),
  googleSignup: (data: { tokenId: string }) => post('/student/auth/google/signup', data),
  forgotPassword: (data: { email: string }) => post('/student/auth/forgot-password', data),
  verifyForgotOtp: (data: { email: string; otp: string }) => post('/student/auth/verify-forgot-otp', data),
  setNewPassword: (data: { email: string; newPassword: string }) => put('/student/auth/set-new-password', data),
  resendOtp: (data: { email: string }) => post('/student/auth/resend-otp', data),
  logout: () => post('/student/auth/logout', {}),
}

export const studentCourseApi = {
  getAllCourses: (params?: Record<string, any>) => get('/student/courses/',  params ),
  getRecommendedCourses: () => get('/student/courses/', ),
  getCourseDetailById: (courseId: string) => get(`/student/courses/${courseId}`),
};

export const studentProfileApi = {
  getProfile: () => get('/student/profile/'),
  editProfile: (data: any) => patch('/student/profile/', data),
};

export const studentSubscriptionApi = {
  getAllPlans: () => get('/student/subscriptions/'),
};

export const studentTeacherApi = {
  getAllTeachers: () => get('/student/teachers/'),
};



