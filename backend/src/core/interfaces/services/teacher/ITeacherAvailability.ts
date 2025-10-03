// core/interfaces/services/ITeacherAvailabilityService.ts
import { ITeacherAvailability } from "../../../../models/TeacherAvailability"
import { IDayAvailability } from "../../../../models/TeacherAvailability"

export interface ITeacherAvailabilityService {
  saveAvailability(teacherId: string, week: IDayAvailability[]): Promise<ITeacherAvailability | null>
  getAvailabilityByTeacherId(teacherId: string): Promise<ITeacherAvailability | null>
}
