// studentRoutes.ts


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
    getCourseReviews: (courseId: string) => `${STUDENT_COURSES}/course-reviews/${courseId}`,
    addCourseReview: `${STUDENT_COURSES}/course-review`,
    getCertificates: `${STUDENT_COURSES}/my/certificates`,
    getCourseCertificate: (courseId: string) => `${STUDENT_COURSES}/certificates/${courseId}`,
    generateCertificate: `${STUDENT_COURSES}/generate/certificate`,
  },

  profile: {
    base: STUDENT_PROFILE,
    contribution: (leetcode: string, github: string) => `${STUDENT_PROFILE}/contributions/${leetcode}/${github}`,
    changePassword: `${STUDENT_AUTH}/change-password/`,
    sendEmailOtp: `${STUDENT_AUTH}/change-email/send-otp/`,
    verifyEmailOtp: `${STUDENT_AUTH}/change-email/verify-otp/`,
  },
  teacher: {
    base: STUDENT_TEACHER,
    getById: (id: string) => `${STUDENT_TEACHER}/${id}`,
    availability: (id: string) => `${STUDENT_TEACHER}/availability/${id}`,
    getReviews: (id: string) => `${STUDENT_TEACHER}/reviews/${id}`,
    addReview: `${STUDENT_TEACHER}/review/add`,
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
    approvescheduledCalls: (id: string) => `${STUDENT_BOOKINGS}/ScheduledCall/${id}`,
    rejectscheduledCalls: (id: string) => `${STUDENT_BOOKINGS}/${id}/reject`,
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
    getMyhistory: `${STUDENT_PURCHASE}/history`,
    myCourseDetails: (courseId: string) => `${STUDENT_PURCHASE}/enrolled/${courseId}`,
    getPurchasedIds: `${STUDENT_PURCHASE}/entrolled-ids`,
    getOrderDetails: (razorpayOrderId: string) => `${STUDENT_PURCHASE}/orderDetails/${razorpayOrderId}`,
    getInvoice: (razorpayOrderId: string) => `${STUDENT_PURCHASE}/receipt/${razorpayOrderId}`

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
    newChatList: `${STUDENT_CHAT}/new/chat`,
  },

  notification: {
    base: `${STUDENT_BASE}/notification`,
    markAsRead: (id: string) => `${STUDENT_BASE}/notification/${id}/read`,
    delete: (id: string) => `${STUDENT_BASE}/notification/${id}`,
  },

  ai: {
    assistant: (courseId: string) => `${SHARED_AI}/message/${courseId}`,
  },


};

