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

  async findByStudent(
    studentId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ certificates: ICourseCertificate[], total: number }> {
    const skip = (page - 1) * limit;

    const query: any = { studentId };

    if (search) {
      query.$or = [
        { certificateNumber: { $regex: search, $options: "i" } },
        { "courseId.title": { $regex: search, $options: "i" } }
      ];
    }

    const certificates = await CourseCertificateModel
      .find(query)
      .populate("courseId", "title coverImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CourseCertificateModel.countDocuments(query);

    return { certificates, total };
  }

  async findOneByCourseId(studentId: string, courseId: string): Promise<ICourseCertificate | null> {
    return await CourseCertificateModel.findOne({
      courseId,
      studentId,
    }).populate("courseId", "title coverImage")
  }

}
