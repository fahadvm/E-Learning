import { IPayout, PayoutStatus } from '../../../models/Payout';

export interface IPayoutRepository {
    create(data: Partial<IPayout>): Promise<IPayout>;
    findById(id: string): Promise<IPayout | null>;
    findAll(filter?: { status?: PayoutStatus; teacherId?: string }, skip?: number, limit?: number): Promise<IPayout[]>;
    count(filter?: { status?: PayoutStatus; teacherId?: string }): Promise<number>;
    updateStatus(id: string, status: PayoutStatus, adminNote?: string): Promise<IPayout | null>;
}
