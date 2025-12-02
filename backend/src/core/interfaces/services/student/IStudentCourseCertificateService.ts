export interface IStudentCourseCertificateService {
  generateCourseCertificate(studentId: string, courseId: string): Promise<any>;
  getMyCourseCertificates(studentId: string): Promise<any>;
}
