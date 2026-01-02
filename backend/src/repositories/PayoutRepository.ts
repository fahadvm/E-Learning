import { injectable } from 'inversify';
import { IPayoutRepository } from '../core/interfaces/repositories/IPayoutRepository';
import { IPayout, Payout, PayoutStatus } from '../models/Payout';

@injectable()
export class PayoutRepository implements IPayoutRepository {
    async create(data: Partial<IPayout>): Promise<IPayout> {
        return await Payout.create(data);
    }

    async findById(id: string): Promise<IPayout | null> {
        return await Payout.findById(id).populate('teacherId', 'name email');
    }

    async findAll(filter: { status?: PayoutStatus; teacherId?: string } = {}, skip: number = 0, limit: number = 10): Promise<IPayout[]> {
        return await Payout.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('teacherId', 'name email');
    }

    async count(filter: { status?: PayoutStatus; teacherId?: string } = {}): Promise<number> {
        return await Payout.countDocuments(filter);
    }

    async updateStatus(id: string, status: PayoutStatus, adminNote?: string): Promise<IPayout | null> {
        const updates: Partial<IPayout> = { status, processedAt: new Date() };
        if (adminNote) updates.adminNote = adminNote;
        return await Payout.findByIdAndUpdate(id, updates, { new: true });
    }
}
