import { injectable, inject } from 'inversify';
import { ITransactionAdminService } from '../../core/interfaces/services/admin/ITransactionAdminService';
import { TYPES } from '../../core/di/types';
import { ITransactionRepository } from '../../core/interfaces/repositories/ITransactionRepository';
import { ITransaction, PaymentStatus } from '../../models/Transaction';
import { FilterQuery } from 'mongoose';

@injectable()
export class TransactionAdminService implements ITransactionAdminService {
    constructor(
        @inject(TYPES.TransactionRepository) private _transactionRepo: ITransactionRepository
    ) { }

    async getAllTransactions(query: {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
    }): Promise<{
        transactions: ITransaction[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const {
            page = 1,
            limit = 10,
            search,
            startDate,
            endDate,
            status,
        } = query;

        const filter: FilterQuery<ITransaction> = {};

        if (status) {
            filter.paymentStatus = status as PaymentStatus;
        }

        if (startDate || endDate) {
            const dateFilter: { $gte?: Date; $lte?: Date } = {};
            if (startDate) dateFilter.$gte = new Date(startDate);
            if (endDate) dateFilter.$lte = new Date(endDate);
            filter.createdAt = dateFilter;
        }

        if (search) {
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(search);
            if (isObjectId) {
                filter._id = search;
            }
        }

        const sort: Record<string, 1 | -1> = { createdAt: -1 };
        const skip = (Number(page) - 1) * Number(limit);
        const limitNum = Number(limit);

        const transactions = await this._transactionRepo.findWithPopulation(filter, {
            skip,
            limit: limitNum,
            sort
        }, [
            'userId', 'teacherId', 'companyId', 'courseId'
        ]);

        const total = await this._transactionRepo.count(filter);

        return {
            transactions,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limitNum)
        };
    }
}
