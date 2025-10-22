// constantRoutes/adminRoutes.ts

// Base paths
const ADMIN_BASE = '/admin';
const ADMIN_AUTH = `${ADMIN_BASE}/auth`;
const ADMIN_STUDENTS = `${ADMIN_BASE}/students`;
const ADMIN_COMPANIES = `${ADMIN_BASE}/companies`;
const ADMIN_TEACHERS = `${ADMIN_BASE}/teachers`;
const ADMIN_COURSES = `${ADMIN_BASE}/courses`;
const ADMIN_SUBSCRIPTIONS = `${ADMIN_BASE}/subscriptions`;
const ADMIN_ORDERS = `${ADMIN_BASE}/orders`;

export const ADMIN_ROUTES = {
  auth: {
    login: `${ADMIN_AUTH}/login`,
    logout: `${ADMIN_AUTH}/logout`,
  },

  students: {
    base: ADMIN_STUDENTS,
    getById: (id: string) => `${ADMIN_STUDENTS}/${id}`,
    block: (id: string) => `${ADMIN_STUDENTS}/${id}/block`,
    unblock: (id: string) => `${ADMIN_STUDENTS}/${id}/unblock`,
  },

  companies: {
    base: ADMIN_COMPANIES,
    getById: (id: string) => `${ADMIN_COMPANIES}/${id}`,
    block: (id: string) => `${ADMIN_COMPANIES}/${id}/block`,
    unblock: (id: string) => `${ADMIN_COMPANIES}/${id}/unblock`,
    unverified: `${ADMIN_COMPANIES}/unverified`,
    verify: (id: string) => `${ADMIN_COMPANIES}/${id}/verify`,
    reject: (id: string) => `${ADMIN_COMPANIES}/${id}/reject`,
    approveAll: `${ADMIN_COMPANIES}/approve-all`,
    rejectAll: `${ADMIN_COMPANIES}/reject-all`,
    employeeById: (employeeId: string) => `${ADMIN_COMPANIES}/employee/${employeeId}`,
  },

  courses: {
    base: ADMIN_COURSES,
    unverified: `${ADMIN_COURSES}/unverified`,
    getById: (id: string) => `${ADMIN_COURSES}/${id}`,
    verify: (id: string) => `${ADMIN_COURSES}/verify/${id}`,
    reject: (id: string) => `${ADMIN_COURSES}/reject/${id}`,
    block: (id: string) => `${ADMIN_COURSES}/block/${id}`,
    unblock: (id: string) => `${ADMIN_COURSES}/unblock/${id}`,
  },

  teachers: {
    base: ADMIN_TEACHERS,
    getById: (id: string) => `${ADMIN_TEACHERS}/${id}`,
    unverified: `${ADMIN_TEACHERS}/unverified`,
    verify: (id: string) => `${ADMIN_TEACHERS}/verify/${id}`,
    reject: (id: string) => `${ADMIN_TEACHERS}/reject/${id}`,
    block: (id: string) => `${ADMIN_TEACHERS}/block/${id}`,
    unblock: (id: string) => `${ADMIN_TEACHERS}/unblock/${id}`,
    coursesByTeacher: (teacherId: string) => `${ADMIN_TEACHERS}/courses/${teacherId}`,
  },

  subscriptions: {
    base: ADMIN_SUBSCRIPTIONS,
    getById: (id: string) => `${ADMIN_SUBSCRIPTIONS}/${id}`,
  },

  orders: {
    companyOrders: `${ADMIN_ORDERS}/company`,
    studentOrders: `${ADMIN_ORDERS}/student`,
  },
};
