import { injectable } from "inversify";
import { ICourseCertificateRepository } from "../core/interfaces/repositories/ICourseCertificateRepository";
import CourseCertificateModel, { ICourseCertificate } from "../models/CourseCertificate";

@injectable()
export class CourseCertificateRepository implements ICourseCertificateRepository {
  async create(data: Partial<ICourseCertificate>) {
    return await CourseCertificateModel.create(data);
  }

  async findByStudentCourse(studentId: string, courseId: string) {
    return await CourseCertificateModel.findOne({ studentId, courseId });
  }

  async findByStudent(studentId: string) {
    return await CourseCertificateModel.find({ studentId }).sort({ createdAt: -1 });
  }
}
