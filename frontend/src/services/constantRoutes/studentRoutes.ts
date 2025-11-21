// studentRoutes.ts

import { verify } from "crypto";

// Base paths
const STUDENT_BASE = '/student';
const STUDENT_AUTH = `${STUDENT_BASE}/auth`;
const STUDENT_COURSES = `${STUDENT_BASE}/courses`;
const STUDENT_PROFILE = `${STUDENT_BASE}/profile`;
const STUDENT_TEACHER = `${STUDENT_BASE}/teacher`;
const STUDENT_BOOKINGS = `${STUDENT_BASE}/bookings`;
const STUDENT_WISHLIST = `${STUDENT_BASE}/wishlist`;
const STUDENT_CART = `${STUDENT_BASE}/cart`;
const STUDENT_PURCHASE = `${STUDENT_BASE}/purchase`;
const STUDENT_SUBSCRIPTIONS = `${STUDENT_BASE}/subscriptions`;
const STUDENT_CHAT = `${STUDENT_BASE}/chat`;
const SHARED_AI = `/shared/ai`;

export const STUDENT_ROUTES = {
  auth: {
    login: `${STUDENT_AUTH}/login`,
    signup: `${STUDENT_AUTH}/signup`,
    verifyOtp: `${STUDENT_AUTH}/verify-otp`,
    googleSignup: `${STUDENT_AUTH}/google/signup`,
    forgotPassword: `${STUDENT_AUTH}/forgot-password`,
    verifyForgotOtp: `${STUDENT_AUTH}/verify-forgot-otp`,
    setNewPassword: `${STUDENT_AUTH}/set-new-password`,
    resendOtp: `${STUDENT_AUTH}/resend-otp`,
    logout: `${STUDENT_AUTH}/logout`,
  },

  courses: {
    base: STUDENT_COURSES,
    getById: (id: string) => `${STUDENT_COURSES}/${id}`,
    compilerRun: `${STUDENT_COURSES}/compiler/run`,
    lessonComplete: (courseId: string, lessonIndex: string) => `${STUDENT_COURSES}/${courseId}/lesson/${lessonIndex}/complete`,
    notes: `${STUDENT_COURSES}/notes`,
    resources: (courseId: string) => `${STUDENT_COURSES}/resources/${courseId}`,
    comments: (courseId: string) => `${STUDENT_COURSES}/comment/${courseId}`,
  },

  profile: {
    base: STUDENT_PROFILE,
  },

  teacher: {
    base: STUDENT_TEACHER,
    getById: (id: string) => `${STUDENT_TEACHER}/${id}`,
    availability: (id: string) => `${STUDENT_TEACHER}/availability/${id}`,
  },

  bookings: {
    base: STUDENT_BOOKINGS,
    availableSlots: (teacherId: string) => `${STUDENT_BOOKINGS}/${teacherId}/available-slots`,
    cancel: (bookingId: string) => `${STUDENT_BOOKINGS}/${bookingId}/cancel`,
    approveReschedule: (bookingId: string) => `${STUDENT_BOOKINGS}/${bookingId}/approve`,
    history: `${STUDENT_BOOKINGS}/history`,
    payments: (teacherId: string) => `${STUDENT_BOOKINGS}/payments/${teacherId}`,
    verify: `${STUDENT_BOOKINGS}/payments/verify`,
    details: (bookingId: string) => `${STUDENT_BOOKINGS}/${bookingId}/details`,
    paymentOrderIdDetails: (paymentOrderId: string) => `${STUDENT_BOOKINGS}/${paymentOrderId}/paymentOrderIdDetails`,
    scheduledCalls: `${STUDENT_BOOKINGS}/ScheduledCall`,
  },

  wishlist: {
    base: STUDENT_WISHLIST,
    getById: (id: string) => `${STUDENT_WISHLIST}/${id}`,
  },

  cart: {
    base: STUDENT_CART,
    getById: (id: string) => `${STUDENT_CART}/${id}`,
    clear: STUDENT_CART,
  },

  purchase: {
    createOrder: `${STUDENT_PURCHASE}/create-order`,
    verifyPayment: `${STUDENT_PURCHASE}/verify-payment`,
    myCourses: `${STUDENT_PURCHASE}/enrolled`,
    myCourseDetails: (courseId: string) => `${STUDENT_PURCHASE}/enrolled/${courseId}`,
    getPurchasedIds: `${STUDENT_PURCHASE}/entrolled-ids`,
    getOrderDetails: (razorpayOrderId: string)=> `${STUDENT_PURCHASE}/orderDetails/${razorpayOrderId}`

  },

  subscriptions: {
    base: STUDENT_SUBSCRIPTIONS,
    createOrder: `${STUDENT_SUBSCRIPTIONS}/create-order`,
    verifyPayment: `${STUDENT_SUBSCRIPTIONS}/verify-payment`,
    activateFree: `${STUDENT_SUBSCRIPTIONS}/activate-free`,
    myPlan: `${STUDENT_SUBSCRIPTIONS}/active`,
  },

  chat: {
    base: STUDENT_CHAT,
    messages: (chatId: string) => `${STUDENT_CHAT}/messages/${chatId}`,
    getChatInfo: (chatId: string) => `${STUDENT_CHAT}/${chatId}`,
    start: `${STUDENT_CHAT}/start`,
  },

  ai: {
    assistant: (courseId: string) => `${SHARED_AI}/message/${courseId}`,
  },
};
