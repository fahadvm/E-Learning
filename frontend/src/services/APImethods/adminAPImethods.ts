import axios from "axios"
import { getRequest, patchRequest, postRequest, putRequest } from "../api"
import { baseURL } from "../AxiosInstance"


const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest

export const adminApiMethods = {
    getStudents: (params: { page?: number; limit?: number; search?: string }) => { return get('/admin/students', params); },
    getStudentById: (studentId: string) =>{ return get(`/admin/students/${studentId}`)},
    blockStudent: (studentId: string) => patch(`/admin/students/${studentId}/block`, {}),
    unblockStudent: (studentId: string) => patch(`/admin/students/${studentId}/unblock`, {}),

    getCompanies: (params: { page?: number; limit?: number; search?: string }) => { return get('/admin/companies', params); },
    getCompanyById: (companyId: string) =>{ return get(`/admin/companies/${companyId}`)},
    blockCompany: (companyId: string) => patch(`/admin/companies/${companyId}/block`, {}),
    unblockCompany: (companyId: string) => patch(`/admin/companies/${companyId}/unblock`, {}),
    UnVerifiedCompanies: (params: { page?: number; limit?: number; search?: string }) => {return get(`/admin/companies/unverified`, params)},
    verifyCompany: (companyId: string) => patch(`/admin/companies/${companyId}/verify`, {}),
    rejectCompany: (companyId: string , rejectReason: string ) => patch(`/admin/companies/${companyId}/reject`, {rejectReason}),
    approveAllCompanies: () => put(`/admin/companies/approve-all`,{}),
    rejectAllCompanies: ( rejectReason: string ) => put(`/admin/companies/reject-all`, {rejectReason}),






}