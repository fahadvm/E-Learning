import { ITeacher } from '../../../../models/Teacher';

export interface IAdminTeacherService {
    getAllTeachers(page: number, limit: number, search: string): Promise<{ teachers: ITeacher[]; total: number }>;
    getUnverifiedTeachers(): Promise<ITeacher[]>;
    verifyTeacher(teacherId: string): Promise<ITeacher | null>;
    rejectTeacher(teacherId: string): Promise<ITeacher | null>;
    blockTeacher(teacherId: string): Promise<ITeacher | null>;
    unblockTeacher(teacherId: string): Promise<ITeacher | null>;
}
