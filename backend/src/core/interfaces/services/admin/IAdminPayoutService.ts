import { IPayout } from '../../../../models/Payout';

export interface IAdminPayoutService {
    getAllPayouts(status?: string): Promise<IPayout[]>;
    approvePayout(payoutId: string): Promise<IPayout>;
    rejectPayout(payoutId: string, reason: string): Promise<IPayout>;
}
