import { inject, injectable } from 'inversify';
import { ITeacherEarningsService, IEarningsStats } from '../../core/interfaces/services/teacher/ITeacherEarningsService';
import { TYPES } from '../../core/di/types';
import { ITransactionRepository } from '../../core/interfaces/repositories/ITransactionRepository';
import { IWalletRepository } from '../../core/interfaces/repositories/IwalletRepository';
import { IPaginationResponse } from '../../core/dtos/teacher/TeacherDTO';
import { ITransaction } from '../../models/Transaction';
import mongoose, { FilterQuery } from 'mongoose';

@injectable()
export class TeacherEarningsService implements ITeacherEarningsService {
    constructor(
        @inject(TYPES.TransactionRepository) private readonly _transactionRepo: ITransactionRepository,
        @inject(TYPES.WalletRepository) private readonly _walletRepo: IWalletRepository
    ) { }

    async getEarningsHistory(
        teacherId: string,
        filters: {
            page: number;
            limit: number;
            type?: 'COURSE' | 'CALL';
            startDate?: string;
            endDate?: string;
        }
    ): Promise<IPaginationResponse<ITransaction>> {
        const { page, limit, type, startDate, endDate } = filters;
        const skip = (page - 1) * limit;

        const query: FilterQuery<ITransaction> = {
            teacherId: new mongoose.Types.ObjectId(teacherId),
            paymentStatus: 'SUCCESS',
            txnNature: { $in: ['CREDIT', 'DEBIT'] },
            type: { $in: ['TEACHER_EARNING', 'TEACHER_WITHDRAWAL'] }
        };


        // Filter by source: Course or Call
        if (type === 'COURSE') {
            query.courseId = { $exists: true, $ne: null };
        } else if (type === 'CALL') {
            query.meetingId = { $exists: true, $ne: null };
        }

        // Proper date range (inclusive start, end of day)
        if (startDate || endDate) {
            const dateFilter: { $gte?: Date; $lte?: Date } = {};
            if (startDate) {
                const d = new Date(startDate);
                d.setHours(0, 0, 0, 0);
                dateFilter.$gte = d;
            }
            if (endDate) {
                const d = new Date(endDate);
                d.setHours(23, 59, 59, 999);
                dateFilter.$lte = d;
            }
            query.createdAt = dateFilter;
        }

        const sort: Record<string, 1 | -1> = { createdAt: -1 };

        const [data, total] = await Promise.all([
            this._transactionRepo.find(query, { skip, limit, sort }),
            this._transactionRepo.count(query),
        ]);


        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }

    async getEarningsStats(teacherId: string): Promise<IEarningsStats> {
        const wallet = await this._walletRepo.findByTeacherId(teacherId);
        if (!wallet) return { balance: 0, totalEarned: 0, totalWithdrawn: 0 };

        return {
            balance: wallet.balance,
            totalEarned: wallet.totalEarned,
            totalWithdrawn: wallet.totalWithdrawn,
        };
    }
}
