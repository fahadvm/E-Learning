// companyRoutes.ts

// Base path
const COMPANY_BASE = '/company';

const COMPANY_AUTH = `${COMPANY_BASE}/auth`;
const COMPANY_COURSES = `${COMPANY_BASE}/courses`;
const COMPANY_EMPLOYEES = `${COMPANY_BASE}/employees`;
const COMPANY_PROFILE = `${COMPANY_BASE}/profile`;
const COMPANY_SUBSCRIPTIONS = `${COMPANY_BASE}/subscriptions`;
const COMPANY_WISHLIST = `${COMPANY_BASE}/wishlist`;
const COMPANY_CART = `${COMPANY_BASE}/cart`;
const COMPANY_PURCHASE = `${COMPANY_BASE}/purchase`;
const COMPANY_LEARNING_PATH = `${COMPANY_BASE}/learning-paths`;

export const COMPANY_ROUTES = {
  auth: {
    signup: `${COMPANY_AUTH}/signup`,
    verifyOtp: `${COMPANY_AUTH}/verify-otp`,
    login: `${COMPANY_AUTH}/login`,
    logout: `${COMPANY_AUTH}/logout`,
    forgotPassword: `${COMPANY_AUTH}/forgot-password`,
    resetPassword: `${COMPANY_AUTH}/reset-password`,
    verifyForgotOtp: `${COMPANY_AUTH}/verify-forgot-otp`,
    resendOtp: `${COMPANY_AUTH}/resend-otp`,
  },

  courses: {
    base: COMPANY_COURSES,
    get: (id: string) => `${COMPANY_COURSES}/${id}`,
    assign: `${COMPANY_COURSES}/assign-course`,
  },

  employees: {
    base: COMPANY_EMPLOYEES,
    get: (id: string) => `${COMPANY_EMPLOYEES}/${id}`,
    requests: `${COMPANY_EMPLOYEES}/requests/pending`,
    block: (id: string) => `${COMPANY_EMPLOYEES}/block/${id}`,
    update: (id: string) => `${COMPANY_EMPLOYEES}/${id}`,
    approve: (id: string) => `${COMPANY_EMPLOYEES}/approve/${id}`,
    reject: (id: string) => `${COMPANY_EMPLOYEES}/reject/${id}`,
  },

  profile: {
    base: COMPANY_PROFILE,
  },

  subscriptions: {
    base: COMPANY_SUBSCRIPTIONS,
  },

  wishlist: {
    base: COMPANY_WISHLIST,
    get: (id: string) => `${COMPANY_WISHLIST}/${id}`,
  },

  cart: {
    base: COMPANY_CART,
    get: (id: string) => `${COMPANY_CART}/${id}`,
    clear: COMPANY_CART,
  },

  purchase: {
    checkoutSession: `${COMPANY_PURCHASE}/checkout-session`,
    verifyPayment: `${COMPANY_PURCHASE}/verify-payment`,
    myCourses: `${COMPANY_PURCHASE}/entrollments`,
    courseDetails: (id: string) => `${COMPANY_PURCHASE}/entrollments/${id}`,
  },

  learningPath: {
    list: `${COMPANY_LEARNING_PATH}`,
    add: `${COMPANY_LEARNING_PATH}`,
    delete: (id: string) => `${COMPANY_LEARNING_PATH}/${id}`,
    edit: (id: string) => `${COMPANY_LEARNING_PATH}/${id}`,
    details: (id: string) => `${COMPANY_LEARNING_PATH}/${id}`,
  },
};
