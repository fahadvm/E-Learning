import axios from "axios"
import { getRequest, patchRequest, postRequest, putRequest } from "../api"
import { baseURL } from "../AxiosInstance"

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;

export const companyApiMethods = {
  // Auth
  signup: (data: any) => post('/company/auth/signup', data),
  verifyOtp: (data: any) => post('/company/auth/verify-otp', data),
  login: (data: any) => post('/company/auth/login', data),
  logout: () => post('/company/auth/logout', {}),

  forgotPassword: (data: any) => post('/company/auth/forgot-password', data),
  resetPassword: (data: any) => post('/company/auth/reset-password', data),
  verifyForgotOtp: (data: any) => post('/company/auth/verify-forgot-otp', data),
  resendOtp: (data: any) => post('/company/auth/resend-otp', data),

  // Courses
  getAllCourses: (params?: { page?: number; limit?: number; search?: string }) => get('/company/courses', params),
  getCourseById: (courseId: string) => get(`/company/courses/${courseId}`),

  // Employees
  addEmployee: (data: any) => post('/company/employees', data),
  getAllEmployees: (params?: { page?: number; limit?: number; search?: string }) => get('/company/employees', params),
  getEmployeeById: (employeeId: string) => get(`/company/employees/${employeeId}`),
  blockEmployee: (employeeId: string, data: any) => patch(`/company/employees/block/${employeeId}`, data),
  updateEmployee: (employeeId: string, data: any) => put(`/company/employees/${employeeId}`, data),

  // Profile
  getCompanyProfile: () => get('/company/profile'),
  updateCompanyProfile: (data: any) => put('/company/profile', data),

  // Subscriptions
  getAllCompanyPlans: () => get('/company/subscriptions'),
};