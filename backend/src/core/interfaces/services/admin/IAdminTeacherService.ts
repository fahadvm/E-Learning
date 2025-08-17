import { IAdminTeacherDTO, PaginatedTeacherDTO } from '../../../../core/dtos/admin/Admin.teacher.Dto';


export interface IAdminTeacherService {
    getAllTeachers(page: number, limit: number, search: string): Promise<PaginatedTeacherDTO>;
    getUnverifiedTeachers(): Promise<IAdminTeacherDTO[]>;
    verifyTeacher(teacherId: string): Promise<IAdminTeacherDTO | null>;
    rejectTeacher(teacherId: string): Promise<IAdminTeacherDTO | null>;
    blockTeacher(teacherId: string): Promise<IAdminTeacherDTO | null>;
    unblockTeacher(teacherId: string): Promise<IAdminTeacherDTO | null>;
}
