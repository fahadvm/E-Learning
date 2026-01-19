// teacherApi.ts

import { PayoutRequestDTO } from "@/types/payout";
import { TeacherProfile, ChangePasswordDTO } from "@/types/teacher/profile";
import { SaveAvailabilityPayload } from "@/types/teacher/teacherTypes";
import { getRequest, postRequest, patchRequest, putRequest, deleteRequest } from "../api";
import { TEACHER_ROUTES } from "../constantRoutes/teacherRoutes";

const get = getRequest,
  post = postRequest,
  patch = patchRequest,
  put = putRequest,
  del = deleteRequest


export const teacherAuthApi = {
  signup: (data: { name: string; email: string; password: string }) => post(TEACHER_ROUTES.auth.signup, data),
  login: (data: { email: string; password: string }) => post(TEACHER_ROUTES.auth.login, data),
  logout: () => post(TEACHER_ROUTES.auth.logout, {}),
  verifyOtp: (data: { email: string; otp: string }) => post(TEACHER_ROUTES.auth.verifyOtp, data),
  resendOtp: (data: { email: string }) => post(TEACHER_ROUTES.auth.resendOtp, data),
  forgotPassword: (data: { email: string }) => post(TEACHER_ROUTES.auth.forgotPassword, data),
  verifyForgotOtp: (data: { email: string; otp: string }) => post(TEACHER_ROUTES.auth.verifyForgotOtp, data),
  setNewPassword: (data: { email: string; newPassword: string }) => post(TEACHER_ROUTES.auth.resetPassword, data),
};

export const teacherProfileApi = {
  getProfile: () => get(TEACHER_ROUTES.profile.base),
  createProfile: (data: TeacherProfile) => post(TEACHER_ROUTES.profile.base, data),
  editProfile: (data: TeacherProfile | Partial<TeacherProfile>) => patch(TEACHER_ROUTES.profile.base, data),
  sendVerificationRequest: (data: FormData) => post(TEACHER_ROUTES.profile.verify, data),
  changePassword: (data: ChangePasswordDTO) => patch(TEACHER_ROUTES.profile.changePassword, data),
  sendChangeEmailOtp: (data: { newEmail: string }) => post(TEACHER_ROUTES.profile.changeEmailOtp, data),
  verifyChangeEmail: (data: { newEmail: string; otp: string }) => post(TEACHER_ROUTES.profile.verifyChangeEmail, data),
  getTeacherReviews: (teacherId: string) => get(TEACHER_ROUTES.profile.reviews(teacherId)),
};

export const teacherAvailabilityApi = {
  getAvailability: () => get(TEACHER_ROUTES.availability.base),
  saveAvailability: (data: SaveAvailabilityPayload) => post(TEACHER_ROUTES.availability.base, data),
};

export const teacherCallRequestApi = {
  getslotsList: () => get(TEACHER_ROUTES.callRequest.base),
  getRequestHistory: (params: { page: number; limit: number; status?: string }) => get(TEACHER_ROUTES.callRequest.history, params),
  getPendingRequests: (params: { page: number; limit: number }) => get(TEACHER_ROUTES.callRequest.pending, params),
  getConfirmedRequests: () => get(TEACHER_ROUTES.callRequest.confirmed),
  getRequestDetails: (bookingId: string) => get(TEACHER_ROUTES.callRequest.details(bookingId)),
  approveRequests: (bookingId: string) => patch(TEACHER_ROUTES.callRequest.approve(bookingId), { status: "approved" }),
  rejectRequests: (bookingId: string, data: { status: string; reason: string }) => patch(TEACHER_ROUTES.callRequest.reject(bookingId), data),
  rescheduleRequests: (bookingId: string, data: { reason: string, nextSlot: { start: string; end: string, date: string, day: string } }) => patch(TEACHER_ROUTES.callRequest.reschedule(bookingId), data),
  tester: (userId: string) => get(TEACHER_ROUTES.callRequest.notificationsTest(userId)),
  testerMark: (data: { notificationId: string }) => post(TEACHER_ROUTES.callRequest.notificationsMarkRead, data),
};

export const teacherChatApi = {
  getmessages: (chatId: string) => get(TEACHER_ROUTES.chat.messages(chatId)),
  getChatInfo: (chatId: string) => get(TEACHER_ROUTES.chat.info(chatId)),
  getuserchat: () => get(TEACHER_ROUTES.chat.base),
  createOrGetChat: (data: { studentId: string; teacherId: string }) => post(TEACHER_ROUTES.chat.start, data),
};

export const teacherNotificationApi = {
  getNotifications: (userId: string) => get(TEACHER_ROUTES.notification.base(userId)),
  markAsRead: (userId: string) => get(TEACHER_ROUTES.notification.markAsRead(userId)),
};

export const teacherCourseApi = {
  addCourse: (data: FormData) => post(TEACHER_ROUTES.courses.create, data),
  getMyCourses: () => get(TEACHER_ROUTES.courses.myCourses),
  getCourseById: (courseId: string) => get(TEACHER_ROUTES.courses.details(courseId)),
  getResources: (courseId: string) => get(TEACHER_ROUTES.courses.fetchResources(courseId)),
  addResources: (courseId: string, data: FormData) => post(TEACHER_ROUTES.courses.uploadResource(courseId), data),
  deleteResources: (resourceId: string) => del(TEACHER_ROUTES.courses.deleteResource(resourceId)),

  // Note: If you have a separate endpoint for detailed fetching versus basic fetching, use it.
  // Assuming getCourseById or similar is used for editing as well.
  getCourseDetailById: (courseId: string) => get(TEACHER_ROUTES.courses.details(courseId)),

  editCourse: (courseId: string, data: FormData) =>
    put(`${TEACHER_ROUTES.courses.update(courseId)}`, data),
  getCourseAnalytics: (courseId: string) => get(TEACHER_ROUTES.courses.analytics(courseId)),
  getCourseReviews: (courseId: string) => get(TEACHER_ROUTES.courses.reviews(courseId)),
};

export const teacherEarningsApi = {
  getEarningsHistory: (params: { page: number; limit: number; type?: string; startDate?: string; endDate?: string }) => get(TEACHER_ROUTES.earnings.history, params),
  getEarningsStats: () => get(TEACHER_ROUTES.earnings.stats),
};

export const teacherEnrollmentApi = {
  getEnrollments: () => get(TEACHER_ROUTES.enrollments.base),
};

export const teacherDashboardApi = {
  getStats: () => get(TEACHER_ROUTES.dashboard.stats),
  getTopCourses: () => get(TEACHER_ROUTES.dashboard.topCourses),
  getEarningsGraph: (timeframe: string = '6months') => get(TEACHER_ROUTES.dashboard.earningsGraph, { timeframe }),
  getUpcomingSchedule: () => get(TEACHER_ROUTES.dashboard.schedule),
};

export const teacherPayoutApi = {
  getWalletStats: () => get(TEACHER_ROUTES.payouts.stats),
  getPayoutHistory: () => get(TEACHER_ROUTES.payouts.history),
  requestPayout: (data: PayoutRequestDTO) => post(TEACHER_ROUTES.payouts.withdraw, data),
};
