import { FilterQuery } from 'mongoose';

export interface IBaseRepository<T> {

  findByEmail(email: string): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  create(Data: Partial<T>): Promise<T>;
  findAllWithFilter(filter: FilterQuery<T>): Promise<T[]>;
  findAll(): Promise<T[]>;
}
