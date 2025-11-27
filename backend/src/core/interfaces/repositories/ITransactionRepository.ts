import { Types } from "mongoose";
import { ITransaction } from "../../../models/Transaction";

export interface ITransactionRepository {
  create(data: Partial<ITransaction>): Promise<ITransaction>;
  findById(id: Types.ObjectId | string): Promise<ITransaction | null>;
  find(filter: any, options?: { skip?: number; limit?: number; sort?: any }): Promise<ITransaction[]>;
  teacherEarnings(teacherId: string): Promise<number>
}