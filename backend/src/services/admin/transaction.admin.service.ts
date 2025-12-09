
import { injectable, inject } from "inversify";
import { ITransactionAdminService } from "../../core/interfaces/services/admin/ITransactionAdminService";
import { TYPES } from "../../core/di/types";
import { ITransactionRepository } from "../../core/interfaces/repositories/ITransactionRepository";

@injectable()
export class TransactionAdminService implements ITransactionAdminService {
    constructor(
        @inject(TYPES.TransactionRepository) private _transactionRepo: ITransactionRepository
    ) { }

    async getAllTransactions(query: any): Promise<{
        transactions: any[];
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

        const filter: any = {};

        if (status) {
            filter.paymentStatus = status;
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        if (search) {
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(search);
            if (isObjectId) {
                filter._id = search;
            }
        }

        const sort: any = { createdAt: -1 };
        const skip = (Number(page) - 1) * Number(limit);
        const limitNum = Number(limit);

        const transactions = await this._transactionRepo.findWithPopulation(filter, {
            skip,
            limit: limitNum,
            sort
        }, [
            { path: 'userId', select: 'name email avatar' },
            { path: 'teacherId', select: 'name email avatar' },
            { path: 'companyId', select: 'name email logo' },
            { path: 'courseId', select: 'title' }
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
