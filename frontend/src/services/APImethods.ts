import { getRequest, patchRequest, postRequest } from "./api"

const get = getRequest;
const post = postRequest;
const patch = patchRequest;

export const TeacherApiMethods = {
    getTeacher: () => get('/teacher/profile'),
    editProfile: (data: any) => post("/teacher/r/profile", data),
    unverified: () => get('/admin/unverified'),
    verify: (id: any) => get(`/admin/verify/${id}`),
    reject: (id: any) => get(`/admin/reject/${id}`)


}

export const CompanyApiMethods = {
    getCompany: () => get('/company/profile'),
    editProfile: (data: any) => post("/company/edit-profile", data),

}

export const StudentApiMethods = {
    getStudent: () => get('/student/profile'),
    editProfile: (data: any) => patch("/student/profile", data),
    

}


