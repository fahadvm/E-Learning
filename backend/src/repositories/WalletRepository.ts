import { IWalletRepository } from "../core/interfaces/repositories/IwalletRepository";
import { TeacherWallet, ITeacherWallet } from "../models/TeacherWallet";
import { Types } from "mongoose";



export class WalletRepository implements IWalletRepository {
    async findByTeacherId(teacherId: Types.ObjectId | string): Promise<ITeacherWallet | null> {
        return await TeacherWallet.findOne({ teacherId }).exec();
    }

    async create(data: Partial<ITeacherWallet>): Promise<ITeacherWallet> {
        const doc = new TeacherWallet(data);
        return await doc.save();
    }

    async save(wallet: ITeacherWallet): Promise<ITeacherWallet> {
        return await wallet.save();
    }

    // atomic credit: upsert wallet if missing and increment fields
    async creditTeacherWallet(params: { teacherId: Types.ObjectId | string; amount: number; transactionId?: Types.ObjectId | string }): Promise<ITeacherWallet> {
        const { teacherId, amount } = params;
        if (amount <= 0) throw new Error("Invalid credit amount");

        const updated = await TeacherWallet.findOneAndUpdate(
            { teacherId },
            {
                $inc: { balance: amount, totalEarned: amount },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).exec();

        // return updated wallet (never null because of upsert)
        return updated as ITeacherWallet;
    }

    async debitTeacherWallet(params: { teacherId: Types.ObjectId | string; amount: number; transactionId?: Types.ObjectId | string }): Promise<ITeacherWallet> {
        const { teacherId, amount } = params;
        if (amount <= 0) throw new Error("Invalid debit amount");

        // fetch and validate
        const wallet = await TeacherWallet.findOne({ teacherId }).exec();
        if (!wallet) throw new Error("Wallet not found");
        if (wallet.balance < amount) throw new Error("Insufficient wallet balance");

        const updated = await TeacherWallet.findOneAndUpdate(
            { teacherId },
            {
                $inc: { balance: -amount, totalWithdrawn: amount },
            },
            { new: true }
        ).exec();

        return updated as ITeacherWallet;
    }

    async deductBalance(teacherId: string, amount: number): Promise<ITeacherWallet> {
        if (amount <= 0) throw new Error("Invalid amount");
        // Atomic check and update
        const updated = await TeacherWallet.findOneAndUpdate(
            { teacherId, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { new: true }
        ).exec();

        if (!updated) {
            // Check if it was existence or balance issue
            const exists = await TeacherWallet.exists({ teacherId });
            if (!exists) throw new Error("Wallet not found");
            throw new Error("Insufficient funds");
        }
        return updated;
    }

    async refundBalance(teacherId: string, amount: number): Promise<ITeacherWallet> {
        if (amount <= 0) throw new Error("Invalid amount");
        const updated = await TeacherWallet.findOneAndUpdate(
            { teacherId },
            { $inc: { balance: amount } },
            { new: true }
        ).exec();
        if (!updated) throw new Error("Wallet not found");
        return updated;
    }

    async recordSuccessfulWithdrawal(teacherId: string, amount: number): Promise<ITeacherWallet> {
        if (amount <= 0) throw new Error("Invalid amount");
        const updated = await TeacherWallet.findOneAndUpdate(
            { teacherId },
            { $inc: { totalWithdrawn: amount } },
            { new: true }
        ).exec();
        if (!updated) throw new Error("Wallet not found");
        return updated;
    }
}
