// src/api/companyApiMethods.ts

import { UpdateCompanyProfileDTO, UpdateEmployeeDTO } from "@/types/company/companyTypes";
import { getRequest, patchRequest, postRequest, putRequest, deleteRequest } from "../api";
import { COMPANY_ROUTES } from "../constantRoutes/companyRoutes";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const del = deleteRequest;

export const companyApiMethods = {
  // Auth
  signup: (data: { name: string; email: string; password: string }) => post(COMPANY_ROUTES.auth.signup, data),
  verifyOtp: (data: { email: string; otp: string }) => post(COMPANY_ROUTES.auth.verifyOtp, data),
  login: (data: { email: string; password: string }) => post(COMPANY_ROUTES.auth.login, data),
  logout: () => post(COMPANY_ROUTES.auth.logout, {}),

  forgotPassword: (data: { email: string }) => post(COMPANY_ROUTES.auth.forgotPassword, data),
  resetPassword: (data: { email: string;otp:string; newPassword: string }) => post(COMPANY_ROUTES.auth.resetPassword, data),
  verifyForgotOtp: (data: { email: string; otp: string }) => post(COMPANY_ROUTES.auth.verifyForgotOtp, data),
  resendOtp: (data: { email: string }) => post(COMPANY_ROUTES.auth.resendOtp, data),

  // Courses
  getAllCourses: (params?: {
    search?: string;
    category?: string;
    level?: string;
    language?: string;
    sort?: string;
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) => get(COMPANY_ROUTES.courses.base, params),

  getCourseById: (courseId: string) => get(COMPANY_ROUTES.courses.get(courseId)),
  getPurchasedCourseIds: () => get(COMPANY_ROUTES.purchase.courseIds),
  getCourseResources: (courseId: string) => get(COMPANY_ROUTES.courses.resources(courseId)),


  // Employees
  addEmployee: (data: {email:string}) => post(COMPANY_ROUTES.employees.base, data),
  getAllEmployees: (params?: { page?: number; limit?: number; search?: string; department?: string; position?: string }) =>
    get(COMPANY_ROUTES.employees.base, params),
  getRequestedEmployees: () => get(COMPANY_ROUTES.employees.requests),
  getEmployeeById: (employeeId: string) => get(COMPANY_ROUTES.employees.get(employeeId)),
  blockEmployee: (employeeId: string, data: {status: boolean}) =>
    patch(COMPANY_ROUTES.employees.block(employeeId), data),
  updateEmployee: (employeeId: string, data: UpdateEmployeeDTO) =>
    put(COMPANY_ROUTES.employees.update(employeeId), data),
  approveEmployeeRequest: (employeeId: string) =>
    patch(COMPANY_ROUTES.employees.approve(employeeId), {}),
  rejectEmployeeRequest: (employeeId: string, reason: string) =>
    patch(COMPANY_ROUTES.employees.reject(employeeId), { reason }),
  inviteEmployee: (email: string) => post(COMPANY_ROUTES.employees.invite, { email }),
  searchEmployees: (query: string) => get(COMPANY_ROUTES.employees.search, { query }),
  getEmployeeProgress: (employeeId: string) => get(COMPANY_ROUTES.employees.progress(employeeId)),
  removeEmployee: (employeeId: string) => del(COMPANY_ROUTES.employees.remove(employeeId)),

  // Profile
  getCompanyProfile: () => get(COMPANY_ROUTES.profile.base),
  updateCompanyProfile: (data: UpdateCompanyProfileDTO) => put(COMPANY_ROUTES.profile.base, data),
  verifyCompanyProfile: (data: FormData) => post(COMPANY_ROUTES.profile.verify, data),
  sendEmailChangeOTP: (newEmail: string) => post(COMPANY_ROUTES.profile.changeEmailSendOTP, { newEmail }),
  verifyEmailChangeOTP: (newEmail: string, otp: string) => post(COMPANY_ROUTES.profile.changeEmailVerifyOTP, { newEmail, otp }),
  changePassword: (currentPassword: string, newPassword: string) => post(COMPANY_ROUTES.profile.changePassword, { currentPassword, newPassword }),

  // Subscriptions
  getAllCompanyPlans: () => get(COMPANY_ROUTES.subscriptions.base),

  // Wishlist
  getWishlist: () => get(COMPANY_ROUTES.wishlist.base),
  addToWishlist: (data: { courseId: string }) => post(COMPANY_ROUTES.wishlist.base, data),
  removeWishlist: (courseId: string) => del(COMPANY_ROUTES.wishlist.get(courseId)),

  // Cart
  getCart: () => get(COMPANY_ROUTES.cart.base),
  addToCart: (data: { courseId: string; seats?: number }) => post(COMPANY_ROUTES.cart.base, data),
  removeFromCart: (courseId: string) => del(COMPANY_ROUTES.cart.get(courseId)),
  clearCart: () => del(COMPANY_ROUTES.cart.clear),
  updateSeat: (courseId: string, seats: number) => patch(COMPANY_ROUTES.cart.updateSeat(courseId), { seats }),

  // Purchase / Checkout
  createCheckoutSession: () =>
    post(COMPANY_ROUTES.purchase.checkoutSession, {}),

  verifyPayment: (data: { sessionId: string }) =>
    post(COMPANY_ROUTES.purchase.verifyPayment, data),
  downloadReciept: (orderId: string) =>
    get(COMPANY_ROUTES.purchase.Reciept(orderId)),

  getmycourses: () => get(COMPANY_ROUTES.purchase.myCourses),
  getmycourseDetails: (courseId: string) =>
    get(COMPANY_ROUTES.purchase.courseDetails(courseId)),
  assignCourseToEmployee: (data: { courseId: string, employeeId: string }) => post(COMPANY_ROUTES.courses.assign, data),
  getOrderHistory: () => get(COMPANY_ROUTES.purchase.orders),


  //learning path
  getLearningPath: () => get(COMPANY_ROUTES.learningPath.list),
  addLearningPaths: (data: any) => post(COMPANY_ROUTES.learningPath.add, data),
  updateLearningPath: (LearningPathId: string, payload: any) => put(COMPANY_ROUTES.learningPath.edit(LearningPathId), payload),
  deleteLearningPath: (LearningPathId: string) => del(COMPANY_ROUTES.learningPath.delete(LearningPathId)),
  detailsLearingPaths: (LearningPathId: string) => get(COMPANY_ROUTES.learningPath.details(LearningPathId)),
  getLearningPaths: (params?: { page?: number; limit?: number; search?: string }) => get(COMPANY_ROUTES.learningPath.list, params),
  getAssignedLearningPaths: (employeeId: string) => get(COMPANY_ROUTES.learningPath.assigned(employeeId)),
  assignLearningPath: (data: { employeeId: string; learningPathId: string }) => post(COMPANY_ROUTES.learningPath.assign, data),
  unassignLearningPath: (params?: { employeeId: string; learningPathId: string }) => del(COMPANY_ROUTES.learningPath.unassign, params),
  getCompanyLeaderboard: () => get(COMPANY_ROUTES.leaderboard.base),
  searchLeaderboard: (params: { name: string }) => get(COMPANY_ROUTES.leaderboard.search, params),

  // Analytics
  getTrackerStats: (range: 'week' | 'month' | 'year') => get(COMPANY_ROUTES.analytics.tracker, { range }),

  // Notifications
  getNotifications: (userId: string) => get(`${COMPANY_ROUTES.notifications.base}/${userId}`),
  markNotificationRead: (notificationId: string) => post(COMPANY_ROUTES.notifications.markRead, { notificationId }),
};
