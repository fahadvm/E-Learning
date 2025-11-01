// src/constants/employeeRoutes.ts

const EMPLOYEE_BASE = '/employee';

const EMPLOYEE_AUTH = `${EMPLOYEE_BASE}/auth`;
const EMPLOYEE_PROFILE = `${EMPLOYEE_BASE}/profile`;
const EMPLOYEE_COMPANY = `${EMPLOYEE_BASE}/company`;
const EMPLOYEE_COURSES = `${EMPLOYEE_BASE}/courses`;

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
  },

  courses: {
    notes: `${EMPLOYEE_COURSES}/notes`,
    enrolled: `${EMPLOYEE_COURSES}/enrolled`,
    compilerRun: `${EMPLOYEE_COURSES}/compiler/run`,
    trackTime: `${EMPLOYEE_COURSES}/tracking/time`,
    details: (courseId: string) => `${EMPLOYEE_COURSES}/enrolled/${courseId}`,
    lessonComplete: (courseId: string, lessonIndex: string) => `${EMPLOYEE_COURSES}/${courseId}/lesson/${lessonIndex}/complete`,
    resources: (courseId: string) => `${EMPLOYEE_COURSES}/resources/${courseId}`,
    comments: (courseId: string) => `${EMPLOYEE_COURSES}/comment/${courseId}`,
  },
};
