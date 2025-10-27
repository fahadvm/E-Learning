// teacherApi.ts

import { getRequest, postRequest, patchRequest, putRequest, deleteRequest } from "../api";
import { TEACHER_ROUTES } from "../constantRoutes/teacherRoutes";

const get = getRequest,
  post = postRequest,
  patch = patchRequest,
  put = putRequest,
  del = deleteRequest;

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
  createProfile: (data: any) => post(TEACHER_ROUTES.profile.base, data),
  editProfile: (data: any) => patch(TEACHER_ROUTES.profile.base, data),
  sendVerificationRequest: (data: any) => post(TEACHER_ROUTES.profile.verify, data),
};

export const teacherCourseApi = {
  getMyCourses: (params?: Record<string, any>) => get(TEACHER_ROUTES.courses.base, params),
  getCourseDetailById: (courseId: string) => get(TEACHER_ROUTES.courses.getById(courseId)),
  addCourse: (data: FormData) => post(TEACHER_ROUTES.courses.base, data),
  updateCourse: (courseId: string, data: any) => patch(TEACHER_ROUTES.courses.update(courseId), data),
  uploadCourseResource: (courseId: string, data: any) => post(TEACHER_ROUTES.courses.uploadResource(courseId), data),
  fetchCourseResources: (courseId: string) => get(TEACHER_ROUTES.courses.fetchResources(courseId)),
  deleteCourseResource: (resourceId: string) => del(TEACHER_ROUTES.courses.deleteResource(resourceId)),
};

export const teacherAvailabilityApi = {
  getAvailability: () => get(TEACHER_ROUTES.availability.base),
  saveAvailability: (data: any) => post(TEACHER_ROUTES.availability.base, data),
};

export const teacherCallRequestApi = {
  getslotsList: () => get(TEACHER_ROUTES.callRequest.base),
  getRequestHistory: (params: { page: number; limit: number; status?: string }) => get(TEACHER_ROUTES.callRequest.history, params),
  getPendingRequests: (params: { page: number; limit: number }) => get(TEACHER_ROUTES.callRequest.pending, params),
  getConfirmedRequests: () => get(TEACHER_ROUTES.callRequest.confirmed),
  getRequestDetails: (bookingId: string) => get(TEACHER_ROUTES.callRequest.details(bookingId)),
  approveRequests: (bookingId: string) => patch(TEACHER_ROUTES.callRequest.approve(bookingId), { status: "approved" }),
  rejectRequests: (bookingId: string, data: { status: string; reason: string }) => patch(TEACHER_ROUTES.callRequest.reject(bookingId), data),
  rescheduleRequests: (bookingId: string, data: { reason: string , nextSlot: { start: string; end: string ,date :string ,day :string } }) => patch(TEACHER_ROUTES.callRequest.reschedule(bookingId), data),
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
