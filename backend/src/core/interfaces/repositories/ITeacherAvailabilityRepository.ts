// core/interfaces/repositories/ITeacherAvailabilityRepository.ts
import { ITeacherAvailability } from '../../../models/TeacherAvailability';

export interface ITeacherAvailabilityRepository {
  saveAvailability(data: Partial<ITeacherAvailability>): Promise<ITeacherAvailability>
  getAvailabilityByTeacherId(teacherId: string): Promise<ITeacherAvailability | null>
  updateAvailability(teacherId: string, data: Partial<ITeacherAvailability>): Promise<ITeacherAvailability | null>
 
}
