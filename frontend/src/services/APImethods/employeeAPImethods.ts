import axios from "axios"
import { getRequest, patchRequest, postRequest } from "../api"
import { baseURL } from "../AxiosInstance"

const get = getRequest;
const post = postRequest;
const patch = patchRequest;

export const adminApiMethods = {
    getTeacher: () => get('/teacher/profile'),
    editProfile: (data: any) => post("/teacher/edit-profile", data),
    unverified: () => get('/admin/unverified'),
    verify: (id: any) => get(`/admin/verify/${id}`),
    reject: (id: any) => get(`/admin/reject/${id}`)


}