import { IStudent } from "../../../../models/Student";
export interface IStudentRepository {
  create(student: Partial<IStudent>): Promise<IStudent>;
  findByEmail(email: string): Promise<IStudent | null>;
  findAll(): Promise<IStudent[]>;
  update(id: string, data: Partial<IStudent>): Promise<IStudent>;
  findOne(filter: Partial<IStudent>): Promise<IStudent | null>;
  updateByEmail(email: string, updateData: Partial<IStudent>): Promise<IStudent | null>;
}