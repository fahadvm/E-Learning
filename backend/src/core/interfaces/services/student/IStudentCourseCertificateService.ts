import { ICourseCertificate } from '../../../../models/CourseCertificate';

export interface IStudentCourseCertificateService {
  generateCourseCertificate(studentId: string, courseId: string): Promise<ICourseCertificate>;
  getCourseCertificate(studentId: string, courseId: string): Promise<ICourseCertificate>;
  getMyCourseCertificates(studentId: string, page: number, limit: number, search: string): Promise<{ certificates: ICourseCertificate[], total: number }>;
}
