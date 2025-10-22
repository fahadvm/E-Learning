// services/TeacherAvailabilityService.ts
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { ITeacherAvailabilityRepository } from '../../core/interfaces/repositories/ITeacherAvailabilityRepository';
import { ITeacherAvailabilityService } from '../../core/interfaces/services/teacher/ITeacherAvailability';
import { ITeacherAvailability } from '../../models/TeacherAvailability';
import { IDayAvailability } from '../../models/TeacherAvailability';

@injectable()
export class TeacherAvailabilityService implements ITeacherAvailabilityService {
  constructor(
    @inject(TYPES.TeacherAvailabilityRepository)
    private readonly _availabilityRepo: ITeacherAvailabilityRepository
  ) {}

  async saveAvailability(teacherId: string, week: IDayAvailability[]): Promise<ITeacherAvailability | null>{
     if (week.some(d => d.slots.length > 4)) {
    throwError(MESSAGES.MAX_4_ALLOWED, STATUS_CODES.BAD_REQUEST);
  }
    const result = await this._availabilityRepo.updateAvailability(teacherId, { week });    
    return  result;
  }

  async getAvailabilityByTeacherId(teacherId: string) {
    return await this._availabilityRepo.getAvailabilityByTeacherId(teacherId);
  }
}
