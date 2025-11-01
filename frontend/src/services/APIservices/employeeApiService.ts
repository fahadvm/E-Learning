// src/api/employeeApiMethods.ts

import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from "../api";
import { EMPLOYEE_ROUTES } from "../constantRoutes/employeeRoutes";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const del = deleteRequest;

export const employeeApiMethods = {
  // Auth
  login: (data: { email: string; password: string }) => post(EMPLOYEE_ROUTES.auth.login, data),
  signup: (data: { name: string; email: string; password: string }) => post(EMPLOYEE_ROUTES.auth.signup, data),
  verifyOtp: (data: { email: string; otp: string }) => post(EMPLOYEE_ROUTES.auth.verifyOtp, data),
  googleSignup: (data: { tokenId: string }) => post(EMPLOYEE_ROUTES.auth.googleSignup, data),
  forgotPassword: (data: { email: string }) => post(EMPLOYEE_ROUTES.auth.forgotPassword, data),
  verifyForgotOtp: (data: { email: string; otp: string }) => post(EMPLOYEE_ROUTES.auth.verifyForgotOtp, data),
  setNewPassword: (data: { email: string; newPassword: string }) => put(EMPLOYEE_ROUTES.auth.setNewPassword, data),
  resendOtp: (data: { email: string }) => post(EMPLOYEE_ROUTES.auth.resendOtp, data),
  logout: () => post(EMPLOYEE_ROUTES.auth.logout, {}),

  // Profile
  getProfile: () => get(EMPLOYEE_ROUTES.profile.base),
  editProfile: (data: any) => patch(EMPLOYEE_ROUTES.profile.base, data),

  // Company
  getMyCompany: () => get(EMPLOYEE_ROUTES.company.getMyCompany),
  findCompany: (data: { companycode: string }) => post(EMPLOYEE_ROUTES.company.find, data),
  sendCompanyRequest: (data: { companyId: string }) => post(EMPLOYEE_ROUTES.company.sendRequest, data),
  getRequestedCompany: () => get(EMPLOYEE_ROUTES.company.requestedCompany),
  cancelCompanyRequest: () => get(EMPLOYEE_ROUTES.company.cancelRequest),
  leaveCompany: () => post(EMPLOYEE_ROUTES.company.leaveCompany, {}),

  // Courses
  getMyCourses: () => get(EMPLOYEE_ROUTES.courses.enrolled),
  getMyCourseDetails: (courseId: string) => get(EMPLOYEE_ROUTES.courses.details(courseId)),
  markLessonComplete: (courseId: string, lessonIndex: string) => get(EMPLOYEE_ROUTES.courses.lessonComplete(courseId, lessonIndex)),
  trackLearningTime: (data:{courseId: string, lessonId: string ,seconds : number}) => patch(EMPLOYEE_ROUTES.courses.trackTime,data),
  saveNotes: (data: { courseId: string; notes: string }) => post(EMPLOYEE_ROUTES.courses.notes, data),
  getCourseResources: (courseId: string) => get(EMPLOYEE_ROUTES.courses.resources(courseId)),
  getCourseComments: (courseId: string) => get(EMPLOYEE_ROUTES.courses.comments(courseId)),
  addCourseComment: (courseId: string, data: { content: string }) => post(EMPLOYEE_ROUTES.courses.comments(courseId), data),
  deleteCourseComment: (commentId: string) => del(`${EMPLOYEE_ROUTES.courses.comments('')}${commentId}`),

};
