// core/interfaces/repositories/student/IStudentRepository.ts
import { IStudent } from '../../../models/Student';
import { FilterQuery } from 'mongoose';

export interface IStudentRepository {
  create(student: Partial<IStudent>): Promise<IStudent>;
  findByEmail(email: string): Promise<IStudent | null>;
  findByGoogleId(googleId: string): Promise<IStudent | null>;
  findAll(skip: number, limit: number, search?: string): Promise<IStudent[]>;
  findOne(filter: FilterQuery<IStudent>): Promise<IStudent | null>;
  findById(id: string): Promise<IStudent | null>;
  update(id: string, data: Partial<IStudent>): Promise<IStudent>;
  updateByEmail(email: string, updateData: Partial<IStudent>): Promise<IStudent | null>;
  updateProfile(studentId: string, profileData: Partial<IStudent>): Promise<IStudent | null>;
  count(search?: string): Promise<number>;
}
