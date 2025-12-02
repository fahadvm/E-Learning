import { ICourseCertificate } from "../../../models/CourseCertificate";

export interface ICourseCertificateRepository {
  create(data: Partial<ICourseCertificate>): Promise<ICourseCertificate>;
  findByStudentCourse(studentId: string, courseId: string): Promise<ICourseCertificate | null>;
  findByStudent(studentId: string): Promise<ICourseCertificate[]>;
}
