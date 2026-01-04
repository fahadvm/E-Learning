import { ITeacher } from "../../../../models/Teacher";

export interface IEmployeeTeacherService {
    getProfile(teacherId: string): Promise<ITeacher | null>;
    getTopTeachers(): Promise<ITeacher[]>;
}
