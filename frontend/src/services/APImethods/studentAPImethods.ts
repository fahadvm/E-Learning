import { getRequest, postRequest, patchRequest, putRequest, deleteRequest } from "../api";

const get = getRequest,
  post = postRequest,
  patch = patchRequest,
  put = putRequest,
  del = deleteRequest;

export const studentAuthApi = {
  login: (data: { email: string; password: string }) => post('/student/auth/login', data),
  signup: (data: { name: string; email: string; password: string }) => post('/student/auth/signup', data),
  verifyOtp: (data: { email: string; otp: string }) => post('/student/auth/verify-otp', data),
  googleSignup: (data: { tokenId: string }) => post('/student/auth/google/signup', data),
  forgotPassword: (data: { email: string }) => post('/student/auth/forgot-password', data),
  verifyForgotOtp: (data: { email: string; otp: string }) => post('/student/auth/verify-forgot-otp', data),
  setNewPassword: (data: { email: string; newPassword: string }) => put('/student/auth/set-new-password', data),
  resendOtp: (data: { email: string }) => post('/student/auth/resend-otp', data),
  logout: () => post('/student/auth/logout', {}),
};

export const studentCourseApi = {
  getAllCourses: (params?: Record<string, any>) => get('/student/courses/', params),
  getRecommendedCourses: () => get('/student/courses'),
  getCourseDetailById: (courseId: string) => get(`/student/courses/${courseId}`),
  codeRunner: (data:{language:string,code: string}) => post(`/student/courses/compiler/run`,data),
  getMyCourses: () => get(`/student/purchase/enrolled`),
  getMyCourseDetails: (courseId: string) => get(`/student/purchase/enrolled/${courseId}`),
  markLessonComplete:(courseId  : string, lessonIndex: string)=> get(`/student/courses/${courseId}/lesson/${lessonIndex}/complete`),
  saveNotes:(data:{courseId:string,notes:string})=> post(`/student/courses/notes`,data),
  getCourseResources :(courseId:string) => get(`/student/courses/resources/${courseId}`),
  getCourseComments :(courseId:string) => get(`/student/courses/comment/${courseId}`),
  addCourseComment :(courseId:string ,data:{ content: string }) => post(`/student/courses/comment/${courseId}`,data),
  deleteCourseComment :(commentId:string) => del(`/student/courses/comment/${commentId}`),

};

export const studentProfileApi = {
  getProfile: () => get('/student/profile/'),
  editProfile: (data: any) => patch('/student/profile/', data),
};

export const studentTeacherApi = {
  getAllTeachers: () => get('/student/teacher/'),
  getTeacherDetails: (teacherId: string) => get(`/student/teacher/${teacherId}`),
  getTeacherAvailability: (teacherId: string) => get(`/student/teacher/availability/${teacherId}`)
};
export const studentBookingApi = {
  getAvailableSlots: (teacherId: string) => get(`/student/bookings/${teacherId}/available-slots`),
  slotBooking: (data: { teacherId: string; endTime: string; courseId?: string, date: string, day: string, startTime: string, note: string }) => post(`/student/bookings`, data),
  cancelBooking: (teacherId: string) => get(`/student/bookings/availability/${teacherId}`),
  approveBooking: (teacherId: string) => get(`/student/bookings/availability/${teacherId}`),
  getBookingHistory: () => get(`/student/bookings/history`),
  payingBooking: (teacherId: string) => get(`/student/bookings/payments/${teacherId}`),
  getBookingDetails: (bookingId: string) => get(`/student/bookings/${bookingId}/details`),
  getScheduledCalls: () => get(`/student/bookings/ScheduledCall`),

};

export const studentWishlistApi = {
  getWishlist: () => get('/student/wishlist/'),
  addToWishlist: (data: { courseId: string }) => post('/student/wishlist/', data),
  removeWishlist: (courseId: string) => del(`/student/wishlist/${courseId}`),
};

export const studentCartApi = {
  getCart: () => get('/student/cart/'),
  addToCart: (data: { courseId: string }) => post('/student/cart/', data),
  removeFromCart: (courseId: string) => del(`/student/cart/${courseId}`),
  clearCart: () => del('/student/cart/'),
};

export const paymentApi = {
  createOrder: (data: { amount: number; courses: string[] }) => post("/student/purchase/create-order", data),
  verifyPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }) => post("/student/purchase/verify-payment", data),
  bookingPayment: (data: { amount: number; bookingId: string }) => post("/student/bookings/payments", data),
  verifyBookingPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }) => post("/student/bookings/payments/verify", data),

};

export const studentSubscriptionApi = {
  getAllPlans: () => get('/student/subscriptions/'),
  createOrder: (planId: string) => post('/student/subscriptions/create-order', { planId }),
  verifyPayment: (payload: { planId: string; razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }) => post('/student/subscriptions/verify-payment', payload),
  activateFreePlan: (planId: string) => post('/student/subscriptions/activate-free', { planId }),
};
export const studentChatApi = {
  getmessages: (chatId: string) => get(`/student/chat/messages/${chatId}`),
  getChatInfo: (chatId: string) => get(`/student/chat/${chatId}`),
  getuserchat: () => get(`/student/chat`),
  startChat: (data: { studentId: string; teacherId: string }) => post('/student/chat/start', data),

};








