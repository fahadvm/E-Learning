// api/adminApiMethods.ts
import { getRequest, patchRequest, postRequest, putRequest, deleteRequest } from "../api";
import { ADMIN_ROUTES } from "../constantRoutes/adminRoutes";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const del = deleteRequest;

export const adminApiMethods = {
  login: (data: any) => post(ADMIN_ROUTES.auth.login, data),
  logout: () => post(ADMIN_ROUTES.auth.logout, {}),
  getProfile: () => get(ADMIN_ROUTES.profile.base),
  updateProfile: (data: any) => get(ADMIN_ROUTES.profile.base),

  // Students
  getStudents: (params?: { page?: number; limit?: number; search?: string , status: string }) => get(ADMIN_ROUTES.students.base, params),
  getStudentById: (id: string) => get(ADMIN_ROUTES.students.getById(id)),
  blockStudent: (id: string) => patch(ADMIN_ROUTES.students.block(id), {}),
  unblockStudent: (id: string) => patch(ADMIN_ROUTES.students.unblock(id), {}),

  // Companies
  getCompanies: (params?: { page?: number; limit?: number; search?: string }) => get(ADMIN_ROUTES.companies.base, params),
  UnVerifiedCompanies: (params?: { page?: number; limit?: number; search?: string }) => get(ADMIN_ROUTES.companies.unverified, params),
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
  rejectCourse: (id: string, rejectReason: string) => patch(ADMIN_ROUTES.courses.reject(id), { rejectReason }),
  blockCourse: (id: string) => patch(ADMIN_ROUTES.courses.block(id), {}),
  unblockCourse: (id: string) => patch(ADMIN_ROUTES.courses.unblock(id), {}),

  // Teachers
  getTeachers: (params?: { page?: number; limit?: number; search?: string , status : string }) => get(ADMIN_ROUTES.teachers.base, params),
  getUnverifiedTeachers: (params?: { page?: number; limit?: number; search?: string ,status:string}) => get(ADMIN_ROUTES.teachers.unverified, params),
  getTeacherById: (id: string) => get(ADMIN_ROUTES.teachers.getById(id)),
  verifyTeacher: (id: string) => patch(ADMIN_ROUTES.teachers.verify(id), {}),
  rejectTeacher: (id: string, rejectReason: string) => patch(ADMIN_ROUTES.teachers.reject(id), { rejectReason }),
  blockTeacher: (id: string) => patch(ADMIN_ROUTES.teachers.block(id), {}),
  unblockTeacher: (id: string) => patch(ADMIN_ROUTES.teachers.unblock(id), {}),
  getTeacherCourses: (teacherId: string) => get(ADMIN_ROUTES.teachers.coursesByTeacher(teacherId)),

  // Subscriptions / Plans
  getPlans: () => get(ADMIN_ROUTES.subscriptions.base),
  getPlanById: (id: string) => get(ADMIN_ROUTES.subscriptions.getById(id)),
  createPlan: (data: any) => post(ADMIN_ROUTES.subscriptions.base, data),
  updatePlan: (id: string, data: any) => put(ADMIN_ROUTES.subscriptions.getById(id), data),
  deletePlan: (id: string) => del(ADMIN_ROUTES.subscriptions.getById(id)),

  // Orders
  getCompanyOrders: () => get(ADMIN_ROUTES.orders.companyOrders),
  getStudentOrders: () => get(ADMIN_ROUTES.orders.studentOrders),
};
