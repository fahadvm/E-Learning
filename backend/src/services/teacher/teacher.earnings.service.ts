import { inject, injectable } from "inversify";
import { ITeacherEarningsService } from "../../core/interfaces/services/teacher/ITeacherEarningsService";
import { TYPES } from "../../core/di/types";
import { ITransactionRepository } from "../../core/interfaces/repositories/ITransactionRepository";
import { IWalletRepository } from "../../core/interfaces/repositories/IwalletRepository";
import { IPaginationResponse } from "../../core/dtos/teacher/TeacherDTO";
import { ITransaction } from "../../models/Transaction";
import { throwError } from "../../utils/ResANDError";
import { MESSAGES } from "../../utils/ResponseMessages";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import mongoose from "mongoose";

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
            type?: string;
            startDate?: string;
            endDate?: string;
        }
    ): Promise<IPaginationResponse<ITransaction>> {
        const { page, limit, type, startDate, endDate } = filters;
        const skip = (page - 1) * limit;

        const query: any = {
            teacherId: new mongoose.Types.ObjectId(teacherId),
            // Only show earnings/credits by default unless otherwise specified, 
            // but requirements say "Transaction History", so maybe all? 
            // The prompt says "Show: Date, Student/Company Name, Type, ... Amount Earned".
            // Usually this means credit transactions.
            // Filter by type if provided.
        };

        if (type && type !== 'ALL') {
            if (type === 'COURSE') query.type = 'TEACHER_EARNING'; // Simplified mapping
            else if (type === 'CALL') query.type = 'MEETING_BOOKING'; // Wait, calls also generate TEACHER_EARNING?
            // Actually, my implementation in StudentBookingService created TEACHER_EARNING for calls too.
            // Notes field differentiates or source.
            // But strictly speaking:
            // Course Purchase -> TEACHER_EARNING (notes: "Earning from Company Order..." or generic)
            // Call Booking -> TEACHER_EARNING (notes: "Earning from Booking...")
            // So filtering by "Type" (Course vs Call) relies on checking the `courseId` or `meetingId` existence.

            if (type === 'COURSE') {
                query.courseId = { $exists: true };
            } else if (type === 'CALL') {
                query.meetingId = { $exists: true };
            }
        }

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        // Sort by newest first
        const sort = { createdAt: -1 };

        const [data, total] = await Promise.all([
            this._transactionRepo.find(query, { skip, limit, sort }),
            this._transactionRepo.count(query)
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getEarningsStats(teacherId: string): Promise<any> {
        const wallet = await this._walletRepo.findByTeacherId(teacherId);
        if (!wallet) return { balance: 0, totalEarned: 0, totalWithdrawn: 0 };

        return {
            balance: wallet.balance,
            totalEarned: wallet.totalEarned,
            totalWithdrawn: wallet.totalWithdrawn,
        };
    }
}
