// src/constants/employeeRoutes.ts


const EMPLOYEE_BASE = '/employee';

const EMPLOYEE_AUTH = `${EMPLOYEE_BASE}/auth`;
const EMPLOYEE_PROFILE = `${EMPLOYEE_BASE}/profile`;
const EMPLOYEE_COMPANY = `${EMPLOYEE_BASE}/company`;
const EMPLOYEE_COURSES = `${EMPLOYEE_BASE}/courses`;
const EMPLOYEE_LEARNING_PATH = `${EMPLOYEE_BASE}/learning-paths`;
const EMPLOYEE_LEADERBOARD = `${EMPLOYEE_BASE}/leaderboard`;

export const EMPLOYEE_ROUTES = {
  auth: {
    login: `${EMPLOYEE_AUTH}/login`,
    signup: `${EMPLOYEE_AUTH}/signup`,
    verifyOtp: `${EMPLOYEE_AUTH}/verify-otp`,
    googleSignup: `${EMPLOYEE_AUTH}/google/signup`,
    forgotPassword: `${EMPLOYEE_AUTH}/forgot-password`,
    verifyForgotOtp: `${EMPLOYEE_AUTH}/verify-forgot-otp`,
    setNewPassword: `${EMPLOYEE_AUTH}/set-new-password`,
    resendOtp: `${EMPLOYEE_AUTH}/resend-otp`,
    logout: `${EMPLOYEE_AUTH}/logout`,
    changePassword: `${EMPLOYEE_AUTH}/change-password`,
    sendEmailOtp: `${EMPLOYEE_AUTH}/change-email/send-otp`,
    verifyEmailOtp: `${EMPLOYEE_AUTH}/change-email/verify`,
  },

  profile: {
    base: EMPLOYEE_PROFILE,
  },

  company: {
    base: EMPLOYEE_COMPANY,
    getMyCompany: `${EMPLOYEE_COMPANY}`,
    find: `${EMPLOYEE_COMPANY}/findcompany`,
    sendRequest: `${EMPLOYEE_COMPANY}/sendrequest`,
    requestedCompany: `${EMPLOYEE_COMPANY}/requestedCompany`,
    cancelRequest: `${EMPLOYEE_COMPANY}/cancelRequest`,
    leaveCompany: `${EMPLOYEE_COMPANY}/leavecompany`,
    invitation: `${EMPLOYEE_COMPANY}/invitation`,
    acceptInvite: `${EMPLOYEE_COMPANY}/accept-invite`,
    rejectInvite: `${EMPLOYEE_COMPANY}/reject-invite`,
  },

  courses: {
    notes: `${EMPLOYEE_COURSES}/notes`,
    enrolled: `${EMPLOYEE_COURSES}/enrolled`,
    compilerRun: `${EMPLOYEE_COURSES}/compiler/run`,
    trackTime: `${EMPLOYEE_COURSES}/tracking/time`,
    progress: `${EMPLOYEE_COURSES}/progress`,
    learningRecords: `${EMPLOYEE_COURSES}/leaningRecords`,
    details: (courseId: string) => `${EMPLOYEE_COURSES}/enrolled/${courseId}`,
    lessonComplete: (courseId: string, lessonIndex: string) => `${EMPLOYEE_COURSES}/${courseId}/lesson/${lessonIndex}/complete`,
    resources: (courseId: string) => `${EMPLOYEE_COURSES}/resources/${courseId}`,
    comments: (courseId: string) => `${EMPLOYEE_COURSES}/comment/${courseId}`,
    getReplies: (commentId: string) => `${EMPLOYEE_COURSES}/comment/replies/${commentId}`,
    toggleLike: (commentId: string) => `${EMPLOYEE_COURSES}/comment/like/${commentId}`,
    toggleDislike: (commentId: string) => `${EMPLOYEE_COURSES}/comment/dislike/${commentId}`,
    addCourseReview: `${EMPLOYEE_COURSES}/course-review`,
    getCourseReviews: (courseId: string) => `${EMPLOYEE_COURSES}/course-reviews/${courseId}`,
  },

  teacher: {
    base: `${EMPLOYEE_BASE}/teachers`,
    getById: (id: string) => `${EMPLOYEE_BASE}/teachers/${id}`,
    addReview: `${EMPLOYEE_BASE}/teachers/review/add`,
    getReviews: (teacherId: string) => `${EMPLOYEE_BASE}/teachers/reviews/${teacherId}`,
    stats: (teacherId: string) => `${EMPLOYEE_BASE}/teachers/teacher/${teacherId}/stats`,
  },

  LearningPaths: {
    get: `${EMPLOYEE_LEARNING_PATH}`,
    details: (learningPathId: string) => `${EMPLOYEE_LEARNING_PATH}/${learningPathId}`,
  },

  leaderboard: {
    allTime: `${EMPLOYEE_LEADERBOARD}/all-time`,
    weekly: `${EMPLOYEE_LEADERBOARD}/weekly`,
    monthly: `${EMPLOYEE_LEADERBOARD}/monthly`,
  },
  notifications: {
    base: '/shared/notification',
    markRead: '/shared/notification/mark-read',
  },
};
