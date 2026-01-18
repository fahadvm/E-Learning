// api/adminApiMethods.ts
import { CreateSubscriptionPlanDTO, TransactionQuery, UpdateAdminProfilePayload, UpdateSubscriptionPlanDTO } from "@/types/admin/adminTypes";
import { getRequest, patchRequest, postRequest, putRequest, deleteRequest } from "../api";
import { ADMIN_ROUTES } from "../constantRoutes/adminRoutes";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const del = deleteRequest;

export const adminApiMethods = {
  login: (data: { email: string; password: string }) => post(ADMIN_ROUTES.auth.login, data),
  logout: () => post(ADMIN_ROUTES.auth.logout, {}),
  getProfile: () => get(ADMIN_ROUTES.profile.base),
  updateProfile: (data: UpdateAdminProfilePayload) => put(ADMIN_ROUTES.profile.base, data),
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => post(ADMIN_ROUTES.profile.changePassword, data),
  requestEmailChange: (data: { newEmail: string }) => post(ADMIN_ROUTES.profile.requestEmailChange, data),
  verifyEmailChange: (data: { newEmail: string; otp: string }) => post(ADMIN_ROUTES.profile.verifyEmailChange, data),
  addNewAdmin: (data: { email: string; password: string; name?: string }) => post(ADMIN_ROUTES.profile.addAdmin, data),

  // Students
  getStudents: (params?: { page?: number; limit?: number; search?: string; status: string }) => get(ADMIN_ROUTES.students.base, params),
  getStudentById: (id: string) => get(ADMIN_ROUTES.students.getById(id)),
  blockStudent: (id: string) => patch(ADMIN_ROUTES.students.block(id), {}),
  unblockStudent: (id: string) => patch(ADMIN_ROUTES.students.unblock(id), {}),

  // Companies
  getCompanies: (params?: { page?: number; limit?: number; search?: string; status: string }) => get(ADMIN_ROUTES.companies.base, params),
  UnVerifiedCompanies: (params?: { page?: number; limit?: number; search?: string; }) => get(ADMIN_ROUTES.companies.unverified, params),
  getCompanyById: (id: string) => get(ADMIN_ROUTES.companies.getById(id)),
  blockCompany: (id: string) => patch(ADMIN_ROUTES.companies.block(id), {}),
  unblockCompany: (id: string) => patch(ADMIN_ROUTES.companies.unblock(id), {}),
  verifyCompany: (id: string) => patch(ADMIN_ROUTES.companies.verify(id), {}),
  rejectCompany: (id: string, rejectReason: string) => patch(ADMIN_ROUTES.companies.reject(id), { rejectReason }),
  approveAllCompanies: () => put(ADMIN_ROUTES.companies.approveAll, {}),
  rejectAllCompanies: (rejectReason: string) => put(ADMIN_ROUTES.companies.rejectAll, { rejectReason }),
  getEmployeeById: (employeeId: string) => get(ADMIN_ROUTES.companies.employeeById(employeeId)),

  // Courses
  getCourses: (params?: { page?: number; limit?: number; search?: string }) => get(ADMIN_ROUTES.courses.base, params),
  getUnverifiedCourses: (params?: { page?: number; limit?: number; search?: string }) => get(ADMIN_ROUTES.courses.unverified, params),
  getCourseById: (id: string) => get(ADMIN_ROUTES.courses.getById(id)),
  verifyCourse: (id: string) => patch(ADMIN_ROUTES.courses.verify(id), {}),
  rejectCourse: (id: string, remarks: string) => patch(ADMIN_ROUTES.courses.reject(id), { remarks }),
  blockCourse: (id: string, reason?: string) => patch(ADMIN_ROUTES.courses.block(id), { reason }),
  unblockCourse: (id: string) => patch(ADMIN_ROUTES.courses.unblock(id), {}),
  getCourseAnalytics: (id: string) => get(`/admin/courses/analytics/${id}`),

  // Teachers
  getTeachers: (params?: { page?: number; limit?: number; search?: string; status: string }) => get(ADMIN_ROUTES.teachers.base, params),
  getUnverifiedTeachers: (params?: { page?: number; limit?: number; search?: string; status: string }) => get(ADMIN_ROUTES.teachers.unverified, params),
  getTeacherById: (id: string) => get(ADMIN_ROUTES.teachers.getById(id)),
  verifyTeacher: (id: string) => patch(ADMIN_ROUTES.teachers.verify(id), {}),
  rejectTeacher: (id: string, reason: string) => patch(ADMIN_ROUTES.teachers.reject(id), { reason }),
  blockTeacher: (id: string) => patch(ADMIN_ROUTES.teachers.block(id), {}),
  unblockTeacher: (id: string) => patch(ADMIN_ROUTES.teachers.unblock(id), {}),
  getTeacherCourses: (teacherId: string) => get(ADMIN_ROUTES.teachers.coursesByTeacher(teacherId)),

  // Subscriptions / Plans
  getPlans: () => get(ADMIN_ROUTES.subscriptions.base),
  getPlanById: (id: string) => get(ADMIN_ROUTES.subscriptions.getById(id)),
  createPlan: (data: CreateSubscriptionPlanDTO) => post(ADMIN_ROUTES.subscriptions.base, data),
  updatePlan: (id: string, data: UpdateSubscriptionPlanDTO) => put(ADMIN_ROUTES.subscriptions.getById(id), data),
  deletePlan: (id: string) => del(ADMIN_ROUTES.subscriptions.getById(id)),

  // Orders
  getCompanyOrders: () => get(ADMIN_ROUTES.orders.companyOrders),
  getStudentOrders: () => get(ADMIN_ROUTES.orders.studentOrders),

  // Transactions
  getTransactions: (params?: TransactionQuery) => get(ADMIN_ROUTES.transactions.base, params),

  // Employees
  getEmployees: (params?: { page?: number; limit?: number; search?: string; status?: string }) => get(ADMIN_ROUTES.employees.base, params),
  getEmployeeFullById: (id: string) => get(ADMIN_ROUTES.employees.getById(id)),
  blockAdminEmployee: (id: string) => patch(ADMIN_ROUTES.employees.block(id), {}),
  unblockAdminEmployee: (id: string) => patch(ADMIN_ROUTES.employees.unblock(id), {}),

  // Reports
  getDashboardStats: () => get(ADMIN_ROUTES.reports.dashboard),

  // Payouts
  getPayouts: (status?: string) => get(ADMIN_ROUTES.payouts.base, { status }),
  approvePayout: (id: string) => patch(ADMIN_ROUTES.payouts.approve(id), {}),
  rejectPayout: (id: string, reason: string) => patch(ADMIN_ROUTES.payouts.reject(id), { reason }),
};
