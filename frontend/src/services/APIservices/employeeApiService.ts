// src/api/employeeApiMethods.ts

import { UpdateEmployeeProfileDTO } from "@/types/employee/employeeTypes";
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
  changePassword: (data: { currentPassword: string, newPassword: string }) => put(EMPLOYEE_ROUTES.auth.changePassword, data),
  sendEmailOtp: (data: { newEmail: string }) => post(EMPLOYEE_ROUTES.auth.sendEmailOtp, data),
  verifyEmailOtp: (data: { newEmail: string, otp: string }) => post(EMPLOYEE_ROUTES.auth.verifyEmailOtp, data),

  // Profile
  getProfile: () => get(EMPLOYEE_ROUTES.profile.base),
  editProfile: (data: UpdateEmployeeProfileDTO) => patch(EMPLOYEE_ROUTES.profile.base, data),

  // Company
  getMyCompany: () => get(EMPLOYEE_ROUTES.company.getMyCompany),
  findCompany: (data: { companycode: string }) => post(EMPLOYEE_ROUTES.company.find, data),
  sendCompanyRequest: (data: { companyId: string }) => post(EMPLOYEE_ROUTES.company.sendRequest, data),
  getRequestedCompany: () => get(EMPLOYEE_ROUTES.company.requestedCompany),
  cancelCompanyRequest: () => get(EMPLOYEE_ROUTES.company.cancelRequest),
  leaveCompany: () => post(EMPLOYEE_ROUTES.company.leaveCompany, {}),
  getInvitation: () => get(EMPLOYEE_ROUTES.company.invitation),
  acceptInvite: () => post(EMPLOYEE_ROUTES.company.acceptInvite, {}),
  rejectInvite: () => post(EMPLOYEE_ROUTES.company.rejectInvite, {}),

  // Courses
  getMyCourses: () => get(EMPLOYEE_ROUTES.courses.enrolled),
  getMyCourseDetails: (courseId: string) => get(EMPLOYEE_ROUTES.courses.details(courseId)),
  markLessonComplete: (courseId: string, lessonIndex: string) => get(EMPLOYEE_ROUTES.courses.lessonComplete(courseId, lessonIndex)),
  trackLearningTime: (data: { courseId: string, seconds: number }) => patch(EMPLOYEE_ROUTES.courses.trackTime, data),
  saveNotes: (data: { courseId: string; notes: string }) => post(EMPLOYEE_ROUTES.courses.notes, data),
  getCourseResources: (courseId: string) => get(EMPLOYEE_ROUTES.courses.resources(courseId)),
  getCourseComments: (courseId: string) => get(EMPLOYEE_ROUTES.courses.comments(courseId)),
  addCourseComment: (courseId: string, data: { content: string }) => post(EMPLOYEE_ROUTES.courses.comments(courseId), data),
  deleteCourseComment: (commentId: string) => del(`${EMPLOYEE_ROUTES.courses.comments('')}${commentId}`),
  getLearningRecord: () => get(EMPLOYEE_ROUTES.courses.learningRecords),
  getProgression: () => get(EMPLOYEE_ROUTES.courses.progress),

  addCourseReview: (data: { courseId: string, rating: number, comment: string }) => post(EMPLOYEE_ROUTES.courses.addCourseReview, data),
  getCourseReviews: (courseId: string) => get(EMPLOYEE_ROUTES.courses.getCourseReviews(courseId)),

  // Teachers
  getTeacherDetails: (teacherId: string) => get(EMPLOYEE_ROUTES.teacher.getById(teacherId)),
  getTeacherReviews: (teacherId: string) => get(EMPLOYEE_ROUTES.teacher.getReviews(teacherId)),
  addTeacherReview: (data: { teacherId: string, rating: number, comment: string, }) => post(EMPLOYEE_ROUTES.teacher.addReview, data),

  getAssignedLearningPaths: () => get(EMPLOYEE_ROUTES.LearningPaths.get),
  getLearningPathById: (learningPathId: string) => get(EMPLOYEE_ROUTES.LearningPaths.details(learningPathId)),

  getAllTimeLeaderBoard: (params: { companyId: string }) => get(EMPLOYEE_ROUTES.leaderboard.allTime, params),
  getWeeklyLeaderBoard: (params: { companyId: string }) => get(EMPLOYEE_ROUTES.leaderboard.weekly, params),
  getMonthlyLeaderBoard: (params: { companyId: string }) => get(EMPLOYEE_ROUTES.leaderboard.monthly, params),

  // Notifications
  getNotifications: (userId: string) => get(`${EMPLOYEE_ROUTES.notifications.base}/${userId}`),
  markNotificationRead: (notificationId: string) => post(EMPLOYEE_ROUTES.notifications.markRead, { notificationId }),
};
