import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IStudentProfileService } from '../../core/interfaces/services/student/IStudentProfileService';
import { IStudentRepository } from '../../core/interfaces/repositories/IStudentRepository';
import { IStudent } from '../../models/Student';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { studentProfileDto, IStudentProfileDTO } from '../../core/dtos/student/Student.profile.Dto';
import { IContribution } from '../../types/common/contribution';
import { IPublicApiRepository } from '../../core/interfaces/repositories/IPublicApiRepository';

@injectable()
export class StudentProfileService implements IStudentProfileService {
  constructor(
    @inject(TYPES.StudentRepository) private readonly _studentRepo: IStudentRepository,
    @inject(TYPES.PublicApiRepository) private readonly _PublicApiRepo: IPublicApiRepository
  ) { }

  async getProfile(studentId: string): Promise<IStudentProfileDTO> {
    const student = await this._studentRepo.findById(studentId);
    if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return studentProfileDto(student);

  }

  async updateStudentProfile(studentId: string, data: Partial<IStudent>): Promise<IStudentProfileDTO> {
    const updated = await this._studentRepo.update(studentId, data);
    if (!updated) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return studentProfileDto(updated);
  }

  async getContributions(leetcodeUsername: string , githubUsername:string): Promise<IContribution> {
      const [github, leetcode] = await Promise.all([
      this._PublicApiRepo.fetchGitHub(githubUsername),
      this._PublicApiRepo.fetchLeetCodeStats(leetcodeUsername),
    ]);
    const contributions = { github, leetcode };
    return contributions; 
  }

}
