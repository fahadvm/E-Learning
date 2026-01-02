import { Types, FilterQuery } from 'mongoose';
import { ITransaction } from '../../../models/Transaction';

export interface ITransactionRepository {
  create(data: Partial<ITransaction>): Promise<ITransaction>;
  findById(id: Types.ObjectId | string): Promise<ITransaction | null>;
  find(
    filter: FilterQuery<ITransaction>,
    options?: { skip?: number; limit?: number; sort?: Record<string, 1 | -1> }
  ): Promise<ITransaction[]>;
  findWithPopulation(
    filter: FilterQuery<ITransaction>,
    options?: { skip?: number; limit?: number; sort?: Record<string, 1 | -1> },
    populate?: string | string[]
  ): Promise<ITransaction[]>;
  teacherEarnings(teacherId: string): Promise<number>;
  count(filter: FilterQuery<ITransaction>): Promise<number>;
}