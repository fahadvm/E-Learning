// repositories/teacher/TeacherAvailabilityRepository.ts
import { injectable } from 'inversify';
import { TeacherAvailability, ITeacherAvailability } from '../models/TeacherAvailability';
import { ITeacherAvailabilityRepository } from '../core/interfaces/repositories/ITeacherAvailabilityRepository';
@injectable()
export class TeacherAvailabilityRepository implements ITeacherAvailabilityRepository {
  async saveAvailability(data: Partial<ITeacherAvailability>): Promise<ITeacherAvailability> {
    const availability = new TeacherAvailability(data);
    return availability.save();
  }

  async getAvailabilityByTeacherId(teacherId: string): Promise<ITeacherAvailability | null> {
    return TeacherAvailability.findOne({ teacherId });
  }

  async updateAvailability(
    teacherId: string,
    data: Partial<ITeacherAvailability>
  ): Promise<ITeacherAvailability | null> {
    return TeacherAvailability.findOneAndUpdate({ teacherId }, { $set: data }, { new: true, upsert: true });
  }
}
