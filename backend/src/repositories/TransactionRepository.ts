import { ITransactionRepository } from "../core/interfaces/repositories/ITransactionRepository";
import { ITransaction, Transaction } from "../models/Transaction";
import mongoose, { Types } from "mongoose";



export class TransactionRepository implements ITransactionRepository {
  async create(data: Partial<ITransaction>): Promise<ITransaction> {
    const doc = new Transaction(data);
    return await doc.save();
  }

  async findById(id: Types.ObjectId | string): Promise<ITransaction | null> {
    return await Transaction.findById(id).exec();
  }

  async find(
    filter: any,
    options: { skip?: number; limit?: number; sort?: any } = {}
  ): Promise<ITransaction[]> {
    const query = Transaction.find(filter);

    if (options.sort) query.sort(options.sort);
    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);

    return await query.exec();
  }

  async findWithPopulation(
    filter: any,
    options: { skip?: number; limit?: number; sort?: any } = {},
    populate?: any
  ): Promise<ITransaction[]> {
    const query = Transaction.find(filter);

    if (options.sort) query.sort(options.sort);
    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    if (populate) query.populate(populate);

    return await query.exec();
  }

  async teacherEarnings(teacherId: string): Promise<number> {
    const result = await Transaction.aggregate([
      {
        $match: {
          teacherId: new mongoose.Types.ObjectId(teacherId),
          type: "TEACHER_EARNING",
          txnNature: "CREDIT",
          paymentStatus: "SUCCESS"
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$amount" }
        }
      }
    ]);

    return result.length > 0 ? result[0].totalEarnings : 0;
  }

  async count(filter: any): Promise<number> {
    return await Transaction.countDocuments(filter).exec();
  }
}
