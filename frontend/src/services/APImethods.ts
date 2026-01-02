import { getRequest, patchRequest, postRequest } from "./api"

const get = getRequest;
const post = postRequest;
const patch = patchRequest;

export const TeacherApiMethods = {
    getTeacher: () => get('/teacher/profile'),
    editProfile: (data: Record<string, unknown>) => post("/teacher/r/profile", data),
    unverified: () => get('/admin/unverified'),
    verify: (id: string) => get(`/admin/verify/${id}`),
    reject: (id: string) => get(`/admin/reject/${id}`)


}

export const CompanyApiMethods = {
    getCompany: () => get('/company/profile'),
    editProfile: (data: Record<string, unknown>) => post("/company/edit-profile", data),

}

export const StudentApiMethods = {
    getStudent: () => get('/student/profile'),
    editProfile: (data: Record<string, unknown>) => patch("/student/profile", data),


}


