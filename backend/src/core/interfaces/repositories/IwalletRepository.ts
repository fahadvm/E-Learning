import {  ITeacherWallet } from '../../../models/TeacherWallet';
import { Types } from 'mongoose';

export interface IWalletRepository {
    findByTeacherId(teacherId: Types.ObjectId | string): Promise<ITeacherWallet | null>;
    create(data: Partial<ITeacherWallet>): Promise<ITeacherWallet>;
    save(wallet: ITeacherWallet): Promise<ITeacherWallet>;
    creditTeacherWallet(params: { teacherId: Types.ObjectId | string; amount: number; transactionId?: Types.ObjectId | string }): Promise<ITeacherWallet>;
    debitTeacherWallet(params: { teacherId: Types.ObjectId | string; amount: number; transactionId?: Types.ObjectId | string }): Promise<ITeacherWallet>;

    // Fine-grained operations
    deductBalance(teacherId: string, amount: number): Promise<ITeacherWallet>; // For pending request
    refundBalance(teacherId: string, amount: number): Promise<ITeacherWallet>; // For rejection
    recordSuccessfulWithdrawal(teacherId: string, amount: number): Promise<ITeacherWallet>; // For approval (update totalWithdrawn)
}