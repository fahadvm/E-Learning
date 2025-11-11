// src/api/companyApiMethods.ts

import LearningPath from "@/app/employee/learningpath/page";
import { getRequest, patchRequest, postRequest, putRequest, deleteRequest } from "../api";
import { COMPANY_ROUTES } from "../constantRoutes/companyRoutes";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const del = deleteRequest;

export const companyApiMethods = {
  // Auth
  signup: (data: any) => post(COMPANY_ROUTES.auth.signup, data),
  verifyOtp: (data: any) => post(COMPANY_ROUTES.auth.verifyOtp, data),
  login: (data: any) => post(COMPANY_ROUTES.auth.login, data),
  logout: () => post(COMPANY_ROUTES.auth.logout, {}),

  forgotPassword: (data: any) => post(COMPANY_ROUTES.auth.forgotPassword, data),
  resetPassword: (data: any) => post(COMPANY_ROUTES.auth.resetPassword, data),
  verifyForgotOtp: (data: any) => post(COMPANY_ROUTES.auth.verifyForgotOtp, data),
  resendOtp: (data: any) => post(COMPANY_ROUTES.auth.resendOtp, data),

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
  addEmployee: (data: any) => post(COMPANY_ROUTES.employees.base, data),
  getAllEmployees: (params?: { page?: number; limit?: number; search?: string }) =>
    get(COMPANY_ROUTES.employees.base, params),
  getRequestedEmployees: () => get(COMPANY_ROUTES.employees.requests),
  getEmployeeById: (employeeId: string) => get(COMPANY_ROUTES.employees.get(employeeId)),
  blockEmployee: (employeeId: string, data: any) =>
    patch(COMPANY_ROUTES.employees.block(employeeId), data),
  updateEmployee: (employeeId: string, data: any) =>
    put(COMPANY_ROUTES.employees.update(employeeId), data),
  approveEmployeeRequest: (employeeId: string, data: { status: "approve" }) =>
    patch(COMPANY_ROUTES.employees.approve(employeeId), data),
  rejectEmployeeRequest: (employeeId: string, data: { status: "reject" }) =>
    patch(COMPANY_ROUTES.employees.reject(employeeId), data),

  // Profile
  getCompanyProfile: () => get(COMPANY_ROUTES.profile.base),
  updateCompanyProfile: (data: any) => put(COMPANY_ROUTES.profile.base, data),

  // Subscriptions
  getAllCompanyPlans: () => get(COMPANY_ROUTES.subscriptions.base),

  // Wishlist
  getWishlist: () => get(COMPANY_ROUTES.wishlist.base),
  addToWishlist: (data: { courseId: string }) => post(COMPANY_ROUTES.wishlist.base, data),
  removeWishlist: (courseId: string) => del(COMPANY_ROUTES.wishlist.get(courseId)),

  // Cart
  getCart: () => get(COMPANY_ROUTES.cart.base),
  addToCart: (data: { courseId: string }) => post(COMPANY_ROUTES.cart.base, data),
  removeFromCart: (courseId: string) => del(COMPANY_ROUTES.cart.get(courseId)),
  clearCart: () => del(COMPANY_ROUTES.cart.clear),

  // Purchase / Checkout
  createCheckoutSession: (data: { courses: string[]; amount: number }) =>
    post(COMPANY_ROUTES.purchase.checkoutSession, data),

  verifyPayment: (data: { sessionId: string }) =>
    post(COMPANY_ROUTES.purchase.verifyPayment, data),
  downloadReciept: (orderId:string) =>
    get(COMPANY_ROUTES.purchase.Reciept(orderId)),

  getmycourses: () => get(COMPANY_ROUTES.purchase.myCourses),
  getmycourseDetails: (courseId: string) =>
    get(COMPANY_ROUTES.purchase.courseDetails(courseId)),
  assignCourseToEmployee: (data: { courseId: string, employeeId: string }) => post(COMPANY_ROUTES.courses.assign, data),


  //learning path
  getLearningPath: () => get(COMPANY_ROUTES.learningPath.list),
  addLearningPaths: (data: any) => post(COMPANY_ROUTES.learningPath.add, data),
  updateLearningPath: (LearningPathId: string, payload: any) => get(COMPANY_ROUTES.learningPath.edit(LearningPathId), payload),
  deleteLearningPath: (LearningPathId: string) => del(COMPANY_ROUTES.learningPath.delete(LearningPathId)),
  detailsLearingPaths: (LearningPathId: string) => get(COMPANY_ROUTES.learningPath.details(LearningPathId)),
  getLearningPaths: (params?: { page?: number; limit?: number; search?: string }) => get(COMPANY_ROUTES.learningPath.list, params),
  getAssignedLearningPaths: (employeeId: string) => get(COMPANY_ROUTES.learningPath.assigned(employeeId)),
  assignLearningPath: (data: { employeeId: string; learningPathId: string }) => post(COMPANY_ROUTES.learningPath.assign, data),
  unassignLearningPath: (params?: { employeeId: string; learningPathId: string }) => del(COMPANY_ROUTES.learningPath.unassign, params),
  getCompanyLeaderboard: () => get(COMPANY_ROUTES.leaderboard.base ),
  searchLeaderboard: (params:{name:string}) => get(COMPANY_ROUTES.leaderboard.search,params ),

};
