import { IPayout } from '../../../../models/Payout';
import { PayoutMethod } from '../../../../models/Payout';

export interface ITeacherPayoutService {
    requestPayout(teacherId: string, amount: number, method: PayoutMethod, details: Record<string, string>): Promise<IPayout>;
    getPayoutHistory(teacherId: string): Promise<IPayout[]>;
    getWalletStats(teacherId: string): Promise<{ balance: number; totalEarned: number; totalWithdrawn: number }>;
}
