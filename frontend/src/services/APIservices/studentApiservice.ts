// studentApi.ts

import { getRequest, postRequest, patchRequest, putRequest, deleteRequest } from "../api";
import { STUDENT_ROUTES } from "../constantRoutes/studentRoutes";

const get = getRequest,
  post = postRequest,
  patch = patchRequest,
  put = putRequest,
  del = deleteRequest;

export const studentAuthApi = {
  login: (data: { email: string; password: string }) => post(STUDENT_ROUTES.auth.login, data),
  signup: (data: { name: string; email: string; password: string }) => post(STUDENT_ROUTES.auth.signup, data),
  verifyOtp: (data: { email: string; otp: string }) => post(STUDENT_ROUTES.auth.verifyOtp, data),
  googleSignup: (data: { tokenId: string }) => post(STUDENT_ROUTES.auth.googleSignup, data),
  forgotPassword: (data: { email: string }) => post(STUDENT_ROUTES.auth.forgotPassword, data),
  verifyForgotOtp: (data: { email: string; otp: string }) => post(STUDENT_ROUTES.auth.verifyForgotOtp, data),
  setNewPassword: (data: { email: string; newPassword: string }) => put(STUDENT_ROUTES.auth.setNewPassword, data),
  resendOtp: (data: { email: string }) => post(STUDENT_ROUTES.auth.resendOtp, data),
  logout: () => post(STUDENT_ROUTES.auth.logout, {}),
};

export const studentCourseApi = {
  getAllCourses: (params?: Record<string, any>) => get(STUDENT_ROUTES.courses.base, params),
  getRecommendedCourses: () => get(STUDENT_ROUTES.courses.base),
  getCourseDetailById: (courseId: string) => get(STUDENT_ROUTES.courses.getById(courseId)),
  codeRunner: (data: { language: string; code: string }) => post(STUDENT_ROUTES.courses.compilerRun, data),
  getMyCourses: () => get(STUDENT_ROUTES.purchase.myCourses),
  getMyCourseDetails: (courseId: string) => get(STUDENT_ROUTES.purchase.myCourseDetails(courseId)),
  markLessonComplete: (courseId: string, lessonIndex: string) => get(STUDENT_ROUTES.courses.lessonComplete(courseId, lessonIndex)),
  saveNotes: (data: { courseId: string; notes: string }) => post(STUDENT_ROUTES.courses.notes, data),
  getCourseResources: (courseId: string) => get(STUDENT_ROUTES.courses.resources(courseId)),
  getCourseComments: (courseId: string) => get(STUDENT_ROUTES.courses.comments(courseId)),
  getPurchasedCourseIds: () => get(STUDENT_ROUTES.purchase.getPurchasedIds),
  addCourseComment: (courseId: string, data: { content: string }) => post(STUDENT_ROUTES.courses.comments(courseId), data),
  deleteCourseComment: (commentId: string) => del(STUDENT_ROUTES.courses.comments(commentId)), 

  addCourseReview : (data:{courseId: string, rating: number, comment: string}) => post(STUDENT_ROUTES.courses.addCourseReview,data),
  getCourseReviews : (courseId: string) => get(STUDENT_ROUTES.courses.getCourseReviews(courseId)),
};

export const studentProfileApi = {
  getProfile: () => get(STUDENT_ROUTES.profile.base),
  editProfile: (data: any) => patch(STUDENT_ROUTES.profile.base, data),
  changePassword: (data:{currentPassword:string , newPassword:string}) => put(STUDENT_ROUTES.profile.changePassword,data),
  sendEmailOtp: (data:{ newEmail:string}) => post(STUDENT_ROUTES.profile.sendEmailOtp,data),
  verifyEmailOtp: (data:{ newEmail:string,otp: string}) => post(STUDENT_ROUTES.profile.verifyEmailOtp,data),
  getContributions: (leetcode:string ,github: string) => get(STUDENT_ROUTES.profile.contribution(leetcode,github)),
};

export const studentTeacherApi = {
  getAllTeachers: () => get(STUDENT_ROUTES.teacher.base),
  getTeacherDetails: (teacherId: string) => get(STUDENT_ROUTES.teacher.getById(teacherId)),
  getTeacherAvailability: (teacherId: string) => get(STUDENT_ROUTES.teacher.availability(teacherId)),
  getTeacherReviews:(teacherId:string) => get(STUDENT_ROUTES.teacher.getReviews(teacherId)),
  addTeacherReview:(data:{teacherId:string,rating:number,comment:string,}) => post(STUDENT_ROUTES.teacher.addReview,data),
};

export const studentBookingApi = {
  getAvailableSlots: (teacherId: string) => get(STUDENT_ROUTES.bookings.availableSlots(teacherId)),
  slotLocking: (data: { teacherId: string; endTime: string; courseId?: string; date: string; day: string; startTime: string; note: string }) =>
    post(STUDENT_ROUTES.bookings.base, data),
  cancelBooking: (bookingId: string, data: { reason: string }) => patch(STUDENT_ROUTES.bookings.cancel(bookingId), data),
  approveBooking: (teacherId: string) => get(STUDENT_ROUTES.bookings.approveReschedule(teacherId)),
  getBookingHistory: (params?: { page?: number; limit?: number; status?: string; teacher?: string }) =>
    get(STUDENT_ROUTES.bookings.history, params),
  payingBooking: (teacherId: string) => get(STUDENT_ROUTES.bookings.payments(teacherId)),
  getBookingDetails: (bookingId: string) => get(STUDENT_ROUTES.bookings.details(bookingId)),
  getBookingDetailsBypaymentOrderId: (paymentOrderId: string) => get(STUDENT_ROUTES.bookings.paymentOrderIdDetails(paymentOrderId)),
  getScheduledCalls: (params: { page: number; limit: number }) => get(STUDENT_ROUTES.bookings.scheduledCalls, params),
  approveReschedule: (bookingId : string) => get(STUDENT_ROUTES.bookings.approvescheduledCalls(bookingId)),
  rejectReschedule: (bookingId : string) => get(STUDENT_ROUTES.bookings.rejectscheduledCalls(bookingId)),
};

export const studentWishlistApi = {
  getWishlist: () => get(STUDENT_ROUTES.wishlist.base),
  addToWishlist: (data: { courseId: string }) => post(STUDENT_ROUTES.wishlist.base, data),
  removeWishlist: (courseId: string) => del(STUDENT_ROUTES.wishlist.getById(courseId)),
};

export const studentCartApi = {
  getCart: () => get(STUDENT_ROUTES.cart.base),
  addToCart: (data: { courseId: string }) => post(STUDENT_ROUTES.cart.base, data),
  removeFromCart: (courseId: string) => del(STUDENT_ROUTES.cart.getById(courseId)),
  clearCart: () => del(STUDENT_ROUTES.cart.clear),
};

export const paymentApi = {
  createOrder: (data: { amount: number; courses: string[] }) => post(STUDENT_ROUTES.purchase.createOrder, data),
  verifyPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    post(STUDENT_ROUTES.purchase.verifyPayment, data),
  bookingPayment: (data: { amount: number; bookingId: string }) => post(STUDENT_ROUTES.bookings.payments(''), data),
  verifyBookingPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    post(STUDENT_ROUTES.bookings.verify, data),
  getOrderDetails: (razorpayOrderId : string ) => get(STUDENT_ROUTES.purchase.getOrderDetails(razorpayOrderId)),
  getPurchaseHistory: (params:{page:number, limit:number} ) => get(STUDENT_ROUTES.purchase.getMyhistory,params)
};

export const studentSubscriptionApi = {
  getAllPlans: () => get(STUDENT_ROUTES.subscriptions.base),
  createOrder: (planId: string) => post(STUDENT_ROUTES.subscriptions.createOrder, { planId }),
  verifyPayment: (payload: { planId: string; razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    post(STUDENT_ROUTES.subscriptions.verifyPayment, payload),
  activateFreePlan: (planId: string) => post(STUDENT_ROUTES.subscriptions.activateFree, { planId }),
  getMySubscription: () => get(STUDENT_ROUTES.subscriptions.myPlan,),
};

export const studentChatApi = {
  getmessages: (chatId: string) => get(STUDENT_ROUTES.chat.messages(chatId)),
  getChatInfo: (chatId: string) => get(STUDENT_ROUTES.chat.getChatInfo(chatId)),
  getTeachersForChat: () => get(STUDENT_ROUTES.chat.newChatList),
  getuserchat: () => get(STUDENT_ROUTES.chat.base),
  createOrGetChat: (data: { studentId: string; teacherId: string }) => post(STUDENT_ROUTES.chat.start, data),
};

export const studentAiApi = {
  aiAssistant: (courseId: string, data: { prompt: string }) => post(STUDENT_ROUTES.ai.assistant(courseId), data),
};


export const studentCertificateApi ={
  getMyCertificates: (params:{page :number, limit : number, search : string}) => get(STUDENT_ROUTES.courses.getCertificates,params),
  generateCertificate: (data:{courseId:string}) => post(STUDENT_ROUTES.courses.generateCertificate,data),
  getCourseCertificate:(courseId:string)=> get(STUDENT_ROUTES.courses.getCourseCertificate(courseId)),
}
