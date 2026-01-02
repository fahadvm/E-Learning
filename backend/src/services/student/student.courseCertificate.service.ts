import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { IStudentCourseCertificateService } from '../../core/interfaces/services/student/IStudentCourseCertificateService';
import { ICourseCertificateRepository } from '../../core/interfaces/repositories/ICourseCertificateRepository';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { IStudentRepository } from '../../core/interfaces/repositories/IStudentRepository';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { generateCertificatePDF } from '../../utils/generateCertificatePDF';
import { uploadPDFtoCloudinary } from '../../utils/uploadPDF';
import { ICourseCertificate } from '../../models/CourseCertificate';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class StudentCourseCertificateService implements IStudentCourseCertificateService {
    constructor(
        @inject(TYPES.CourseCertificateRepository)
        private readonly _certRepo: ICourseCertificateRepository,

        @inject(TYPES.CourseRepository)
        private readonly _courseRepo: ICourseRepository,

        @inject(TYPES.StudentRepository)
        private readonly _studentRepo: IStudentRepository
    ) { }

    async generateCourseCertificate(studentId: string, courseId: string): Promise<ICourseCertificate> {
        const student = await this._studentRepo.findById(studentId);
        const course = await this._courseRepo.findById(courseId);
        if (!student || !course) throwError(MESSAGES.INVALID_DATA);
        const already = await this._certRepo.findByStudentCourse(studentId, courseId);
        if (already) return already as ICourseCertificate;
        const certNumber = 'COURSE-CERT-' + Date.now();
        const pdfBuffer = await generateCertificatePDF({
            studentName: student.name,
            courseName: course.title,
            certificateNumber: certNumber,
        });

        const certificateUrl = await uploadPDFtoCloudinary(pdfBuffer);

        return await this._certRepo.create({
            studentId: new Types.ObjectId(studentId),
            courseId: new Types.ObjectId(courseId),
            certificateUrl,
            certificateNumber: certNumber,
        });
    }

    async getMyCourseCertificates(studentId: string, page: number, limit: number, search: string): Promise<{ certificates: ICourseCertificate[], total: number }> {
        return await this._certRepo.findByStudent(studentId, page, limit, search);
    }
    async getCourseCertificate(studentId: string, courseId: string): Promise<ICourseCertificate> {
        const certificate = await this._certRepo.findOneByCourseId(studentId, courseId);
        if (!certificate) throwError(MESSAGES.ACCOUNT_BLOCKED, STATUS_CODES.NOT_FOUND);
        return certificate;
    }

}
