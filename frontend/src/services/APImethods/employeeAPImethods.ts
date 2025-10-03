import axios from "axios"
import { getRequest, patchRequest, postRequest, putRequest } from "../api"
import { baseURL } from "../AxiosInstance"

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;

export const employeeApiMethods = {
    login: (data: { email: string; password: string }) => post('/employee/auth/login', data),
    signup: (data: { name: string; email: string; password: string }) => post('/employee/auth/signup', data),
    verifyOtp: (data: { email: string; otp: string }) => post('/employee/auth/verify-otp', data),
    googleSignup: (data: { tokenId: string }) => post('/employee/auth/google/signup', data),
    forgotPassword: (data: { email: string }) => post('/employee/auth/forgot-password', data),
    verifyForgotOtp: (data: { email: string; otp: string }) => post('/employee/auth/verify-forgot-otp', data),
    setNewPassword: (data: { email: string; newPassword: string }) => put('/employee/auth/set-new-password', data),
    resendOtp: (data: { email: string }) => post('/employee/auth/resend-otp', data),
    logout: () => post('/employee/auth/logout', {}),

    getProfile: () => get('/employee/profile'),
    editProfile: (data: any) => patch('/employee/profile', data),


    getMyCompany: () => get('/employee/company'),
    findCompany: (data: { companycode: string }) => post('/employee/company/findcompany', data),
    sendCompanyRequest: (data: { companyId: string }) => post('/employee/company/sendrequest', data),
    getRequestedCompany: () => get('/employee/company/requestedCompany'),
    cancelCompanyRequest: (data: { companyId: string }) => post('/employee/company/cancelrequest', data),
    // leaveCompany:() => post('/employee/company/leavecompany'),


    getMyCourses: () => get(`/employee/courses/enrolled`),
    getMyCourseDetails: (courseId: string) => get(`/employee/courses/enrolled/${courseId}`),


}