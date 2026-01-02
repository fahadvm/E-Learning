import { injectable } from 'inversify';
import { ICourseCertificateRepository } from '../core/interfaces/repositories/ICourseCertificateRepository';
import CourseCertificateModel, { ICourseCertificate } from '../models/CourseCertificate';
import { FilterQuery, Types } from 'mongoose';

@injectable()
export class CourseCertificateRepository implements ICourseCertificateRepository {
  async create(data: Partial<ICourseCertificate>): Promise<ICourseCertificate> {
    return await CourseCertificateModel.create(data);
  }

  async findByStudentCourse(studentId: string, courseId: string): Promise<ICourseCertificate | null> {
    return await CourseCertificateModel.findOne({ studentId, courseId });
  }

  async findByStudent(
    studentId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ certificates: ICourseCertificate[], total: number }> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<ICourseCertificate> = { studentId: new Types.ObjectId(studentId) };

    if (search) {
      query.$or = [
        { certificateNumber: { $regex: search, $options: 'i' } }
      ];
      // Note: searching by populated field like 'courseId.title' doesn't work directly in find()
    }

    const certificates = await CourseCertificateModel
      .find(query)
      .populate('courseId', 'title coverImage')
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
    }).populate('courseId', 'title coverImage');
  }

}
