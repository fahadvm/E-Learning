import { injectable, inject } from 'inversify';
import { ITeacherPayoutService } from '../../core/interfaces/services/teacher/ITeacherPayoutService';
import { TYPES } from '../../core/di/types';
import { IPayoutRepository } from '../../core/interfaces/repositories/IPayoutRepository';
import { IWalletRepository } from '../../core/interfaces/repositories/IwalletRepository';
import { ITransactionRepository } from '../../core/interfaces/repositories/ITransactionRepository';
import { IPayout, PayoutMethod, PayoutStatus } from '../../models/Payout';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { Types } from 'mongoose';

@injectable()
export class TeacherPayoutService implements ITeacherPayoutService {
    constructor(
        @inject(TYPES.PayoutRepository) private readonly _payoutRepo: IPayoutRepository,
        @inject(TYPES.WalletRepository) private readonly _walletRepo: IWalletRepository,
        @inject(TYPES.TransactionRepository) private readonly _transactionRepo: ITransactionRepository
    ) { }

    async requestPayout(teacherId: string, amount: number, method: PayoutMethod, details: Record<string, string>): Promise<IPayout> {
        if (amount <= 0) throwError('Invalid amount', STATUS_CODES.BAD_REQUEST);

        // 1. Deduct Balance (Atomic)
        // This will throw if insufficient funds
        await this._walletRepo.deductBalance(teacherId, amount);

        try {
            // 2. Create Payout Request
            const payout = await this._payoutRepo.create({
                teacherId: new Types.ObjectId(teacherId),
                amount,
                method,
                details,
                status: PayoutStatus.PENDING,
            });

            // 3. Create Pending Transaction Record (Optional, but good for audit)
            await this._transactionRepo.create({
                teacherId: new Types.ObjectId(teacherId),
                amount: amount,
                grossAmount: amount, // For withdrawal, gross = net
                type: 'TEACHER_WITHDRAWAL',
                txnNature: 'DEBIT',
                paymentStatus: 'PENDING',
                paymentMethod: 'MANUAL', // or WALLET mapping
                notes: `Payout Request ${payout._id}`
            });

            return payout;

        } catch (error) {
            // Rollback: Refund balance if payout creation fails
            await this._walletRepo.refundBalance(teacherId, amount);
            throw error;
        }
    }

    async getPayoutHistory(teacherId: string): Promise<IPayout[]> {
        return await this._payoutRepo.findAll({ teacherId });
    }

    async getWalletStats(teacherId: string): Promise<{ balance: number; totalEarned: number; totalWithdrawn: number }> {
        const wallet = await this._walletRepo.findByTeacherId(teacherId);
        if (!wallet) return { balance: 0, totalEarned: 0, totalWithdrawn: 0 };
        return {
            balance: wallet.balance,
            totalEarned: wallet.totalEarned,
            totalWithdrawn: wallet.totalWithdrawn,
        };
    }
}
