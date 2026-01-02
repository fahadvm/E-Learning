import { IAdminTeacherDTO, PaginatedTeacherDTO, IAdminTeacherDetailsDTO } from '../../../../core/dtos/admin/Admin.teacher.Dto';


export interface IAdminTeacherService {
    getAllTeachers(page: number, limit: number, search: string, status: string): Promise<PaginatedTeacherDTO>;
    getVerificationRequests(pageNum: number, limitNum: number, search: string): Promise<PaginatedTeacherDTO>;
    verifyTeacher(teacherId: string): Promise<IAdminTeacherDTO | null>;
    rejectTeacher(teacherId: string, reason: string): Promise<IAdminTeacherDTO | null>;
    blockTeacher(teacherId: string): Promise<IAdminTeacherDTO | null>;
    unblockTeacher(teacherId: string): Promise<IAdminTeacherDTO | null>;
    getTeacherById(teacherId: string): Promise<IAdminTeacherDetailsDTO>;
}
