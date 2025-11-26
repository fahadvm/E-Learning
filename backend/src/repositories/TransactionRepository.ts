import { ITransactionRepository } from "../core/interfaces/repositories/ITransactionRepository";
import { ITransaction, Transaction } from "../models/Transaction";
import { Types } from "mongoose";



export class TransactionRepository implements ITransactionRepository{
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
}
