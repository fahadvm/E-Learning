// application/services/TeacherProfileService.ts
import { injectable, inject } from 'inversify';
import { ITeacherProfileService } from '../../core/interfaces/services/teacher/ITeacherProfileService';
import { ITeacherRepository } from '../../core/interfaces/repositories/ITeacherRepository';
import { ITeacher, VerificationStatus } from '../../models/Teacher';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import cloudinary from '../../config/cloudinary';

@injectable()
export class TeacherProfileService implements ITeacherProfileService {
  constructor(
    @inject(TYPES.TeacherRepository) private _teacherRepository: ITeacherRepository
  ) {}

  async createProfile(data: Partial<ITeacher>): Promise<ITeacher> {
    if (!data.email) throwError(MESSAGES.EMAIL_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const existing = await this._teacherRepository.findByEmail(data.email);
    if (existing) throwError(MESSAGES.TEACHER_ALREADY_EXISTS, STATUS_CODES.CONFLICT);

    return await this._teacherRepository.create(data);
  }

  async updateProfile(teacherId: string, data: Partial<ITeacher>): Promise<ITeacher | null> {

    const updated = await this._teacherRepository.updateById(teacherId, data);
    if (!updated) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return updated;
  }

  async getProfile(teacherId: string): Promise<ITeacher | null> {
    const teacher = await this._teacherRepository.findById(teacherId);
    if (!teacher) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return teacher;
  }


   async sendVerificationRequest(teacherId: string , file: Express.Multer.File):Promise<ITeacher > {
    const teacher = await this._teacherRepository.findById(teacherId);
    if (!teacher) throwError(MESSAGES.TEACHER_NOT_FOUND,STATUS_CODES.NOT_FOUND);

    if (teacher.verificationStatus === VerificationStatus.VERIFIED)
      throwError(MESSAGES.ALREADY_VERIFIED, STATUS_CODES.CONFLICT);

    if (teacher.verificationStatus === VerificationStatus.PENDING)
      throwError(MESSAGES.ALREADY_REQUESTED_VERIFICATION, STATUS_CODES.CONFLICT);

    const isComplete = await this._teacherRepository.isProfileComplete(teacherId);
    if (!isComplete) throwError(MESSAGES.COMPLETE_PROFILE, STATUS_CODES.CONFLICT);
     const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'teacher_resumes',
      resource_type: 'auto',
      use_filename: true,
    });

    const resumeUrl = uploadResult.secure_url;
    const updated = await this._teacherRepository.sendVerificationRequest(teacherId,VerificationStatus.PENDING,resumeUrl);
    if(!updated) throwError(MESSAGES.VERIFICATION_FAILED,STATUS_CODES.BAD_REQUEST);

    return updated;
  }
}
