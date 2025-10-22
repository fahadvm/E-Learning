import axios from "axios"
import { getRequest, patchRequest, postRequest, putRequest, deleteRequest } from "../api"
import { baseURL } from "../AxiosInstance"

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const del = deleteRequest;

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
  getAllCourses: (params?: {  search?: string;
    category?: string;
    level?: string;
    language?: string;
    sort?: string;
    order?: "asc" | "desc";
    page?: number;
    limit?: number; }) => get('/company/courses', params),
  getCourseById: (courseId: string) => get(`/company/courses/${courseId}`),




  // Employees
  addEmployee: (data: any) => post('/company/employees', data),
  getAllEmployees: (params?: { page?: number; limit?: number; search?: string }) => get('/company/employees', params),
  getRequestedEmployees: () => get('/company/employees/requests/pending'),
  getEmployeeById: (employeeId: string) => get(`/company/employees/${employeeId}`),
  blockEmployee: (employeeId: string, data: any) => patch(`/company/employees/block/${employeeId}`, data),
  updateEmployee: (employeeId: string, data: any) => put(`/company/employees/${employeeId}`, data),
  approveEmployeeRequest : (employeeId: string, data: {status : "approve"}) => patch(`/company/employees/approve/${employeeId}`, data),
  rejectEmployeeRequest: (employeeId: string, data: {status : "reject"}) => patch(`/company/employees/reject/${employeeId}`, data),

  // Profile
  getCompanyProfile: () => get('/company/profile'),
  updateCompanyProfile: (data: any) => put('/company/profile', data),

  // Subscriptions
  getAllCompanyPlans: () => get('/company/subscriptions'),


  getWishlist: () => get('/company/wishlist/'),
  addToWishlist: (data: { courseId: string }) => post('/company/wishlist/', data),
  removeWishlist: (courseId: string) => del(`/company/wishlist/${courseId}`),


  getCart: () => get('/company/cart/'),
  addToCart: (data: { courseId: string }) => post('/company/cart/', data),
  removeFromCart: (courseId: string) => del(`/company/cart/${courseId}`),
  clearCart: () => del('/company/cart/'),

  createCheckoutSession: (data: { courses: string[], amount: number }) => post('/company/purchase/checkout-session', data),
  verifyPayment: (data: { sessionId: string }) => post('/company/purchase/verify-payment', data),
  getmycourses: () => get('/company/purchase/entrollments'),
  getmycourseDetails: (courseId: string) => get(`/company/purchase/entrollments/${courseId}`),
};