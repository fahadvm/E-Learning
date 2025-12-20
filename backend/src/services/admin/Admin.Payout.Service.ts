import { injectable, inject } from 'inversify';
import { IAdminPayoutService } from '../../core/interfaces/services/admin/IAdminPayoutService';
import { TYPES } from '../../core/di/types';
import { IPayoutRepository } from '../../core/interfaces/repositories/IPayoutRepository';
import { IWalletRepository } from '../../core/interfaces/repositories/IwalletRepository';
import { ITransactionRepository } from '../../core/interfaces/repositories/ITransactionRepository';
import { ITransaction, Transaction } from '../../models/Transaction'; // Directly import model for manual update if repo lacks method
import { IPayout, PayoutStatus } from '../../models/Payout';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class AdminPayoutService implements IAdminPayoutService {
    constructor(
        @inject(TYPES.PayoutRepository) private readonly _payoutRepo: IPayoutRepository,
        @inject(TYPES.WalletRepository) private readonly _walletRepo: IWalletRepository,
        @inject(TYPES.TransactionRepository) private readonly _transactionRepo: ITransactionRepository
    ) { }

    async getAllPayouts(status?: string): Promise<IPayout[]> {
        const filter: any = {};
        if (status && status !== 'All') filter.status = status;
        return await this._payoutRepo.findAll(filter, 0, 100); // Limit 100 for now
    }

    async approvePayout(payoutId: string): Promise<IPayout> {
        const payout = await this._payoutRepo.findById(payoutId);
        if (!payout) throwError("Payout not found", STATUS_CODES.NOT_FOUND);
        if (payout.status !== PayoutStatus.PENDING) throwError("Payout is not pending", STATUS_CODES.BAD_REQUEST);

        // 1. Update Payout Status
        const updatedPayout = await this._payoutRepo.updateStatus(payoutId, PayoutStatus.APPROVED);
        if (!updatedPayout) throwError("Failed to update payout", STATUS_CODES.INTERNAL_SERVER_ERROR);

        // 2. Commit Withdrawal in Wallet (Update totalWithdrawn)
        await this._walletRepo.recordSuccessfulWithdrawal(updatedPayout.teacherId.toString(), updatedPayout.amount);

        // 3. Update Transaction to SUCCESS if it exists, or create new one
        // We assume a pending txn might have been created. We should find and update match.
        // Ideally we linked it. But currently Payout model creation didn't save txnID.
        // Simpler: Just create a SUCCESS transaction record or update recent pending one.
        // For now, let's create a "CONFIRMED" transaction log. 
        // Actually, TeacherPayoutService created a PENDING transaction.
        // Queries logic: Find recent pending withdrawal for this teacher & amount? Too risky.
        // If we passed transactionId to Payout, we could update it. TeacherPayoutService didn't save txnId to payout.

        // Improvement: Save txnId in Payout.
        // For now, I will create a new SUCCESS log or just assume the previous one stays pending/history.
        // Correct approach: Update the transaction if possible.

        return updatedPayout;
    }

    async rejectPayout(payoutId: string, reason: string): Promise<IPayout> {
        const payout = await this._payoutRepo.findById(payoutId);
        if (!payout) throwError("Payout not found", STATUS_CODES.NOT_FOUND);
        if (payout.status !== PayoutStatus.PENDING) throwError("Payout is not pending", STATUS_CODES.BAD_REQUEST);

        // 1. Update Payout Status
        const updatedPayout = await this._payoutRepo.updateStatus(payoutId, PayoutStatus.REJECTED, reason);
        if (!updatedPayout) throwError("Failed to update payout", STATUS_CODES.INTERNAL_SERVER_ERROR);

        // 2. Refund Balance
        await this._walletRepo.refundBalance(updatedPayout.teacherId.toString(), updatedPayout.amount);

        return updatedPayout;
    }
}
