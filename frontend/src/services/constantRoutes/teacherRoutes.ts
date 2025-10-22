// constantRoutes/teacherRoutes.ts

// Base paths
const TEACHER_BASE = '/teacher';
const TEACHER_AUTH = `${TEACHER_BASE}/auth`;
const TEACHER_PROFILE = `${TEACHER_BASE}/profile`;
const TEACHER_COURSES = `${TEACHER_BASE}/courses`;
const TEACHER_AVAILABILITY = `${TEACHER_BASE}/availability`;
const TEACHER_CALL_REQUEST = `${TEACHER_BASE}/call-request`;
const TEACHER_CHAT = `${TEACHER_BASE}/chat`;
const TEACHER_NOTIFICATION = `/shared/notification`;

export const TEACHER_ROUTES = {
  auth: {
    signup: `${TEACHER_AUTH}/signup`,
    login: `${TEACHER_AUTH}/login`,
    logout: `${TEACHER_AUTH}/logout`,
    verifyOtp: `${TEACHER_AUTH}/verify-otp`,
    resendOtp: `${TEACHER_AUTH}/resend-otp`,
    forgotPassword: `${TEACHER_AUTH}/forgot-password`,
    verifyForgotOtp: `${TEACHER_AUTH}/verify-forgot-otp`,
    resetPassword: `${TEACHER_AUTH}/reset-password`,
  },

  profile: {
    base: TEACHER_PROFILE,
    verify: `${TEACHER_PROFILE}/verify`,
  },

  courses: {
    base: TEACHER_COURSES,
    getById: (id: string) => `${TEACHER_COURSES}/${id}`,
    update: (id: string) => `${TEACHER_COURSES}/${id}`,
    uploadResource: (courseId: string) => `${TEACHER_COURSES}/${courseId}/resources`,
    fetchResources: (courseId: string) => `${TEACHER_COURSES}/${courseId}/resources`,
    deleteResource: (resourceId: string) => `${TEACHER_COURSES}/${resourceId}/resources`,
  },

  availability: {
    base: TEACHER_AVAILABILITY,
  },

  callRequest: {
    base: TEACHER_CALL_REQUEST,
    history: `${TEACHER_CALL_REQUEST}/history`,
    pending: `${TEACHER_CALL_REQUEST}/pending`,
    confirmed: `${TEACHER_CALL_REQUEST}/confirmed`,
    details: (bookingId: string) => `${TEACHER_CALL_REQUEST}/${bookingId}`,
    approve: (bookingId: string) => `${TEACHER_CALL_REQUEST}/${bookingId}/approve`,
    reject: (bookingId: string) => `${TEACHER_CALL_REQUEST}/${bookingId}/reject`,
    cancel: (bookingId: string) => `${TEACHER_CALL_REQUEST}/${bookingId}/cancel`,
    notificationsTest: (userId: string) => `${TEACHER_CALL_REQUEST}/notifications/testing/${userId}`,
    notificationsMarkRead: `${TEACHER_CALL_REQUEST}/notifications/testing/markread`,
  },

  chat: {
    base: TEACHER_CHAT,
    messages: (chatId: string) => `${TEACHER_CHAT}/messages/${chatId}`,
    info: (chatId: string) => `${TEACHER_CHAT}/${chatId}`,
    start: `${TEACHER_CHAT}/start`,
  },

  notification: {
    base: (userId: string) => `${TEACHER_NOTIFICATION}/${userId}`,
    markAsRead: (userId: string) => `${TEACHER_NOTIFICATION}/${userId}/mark-as-read`,
  },
};
