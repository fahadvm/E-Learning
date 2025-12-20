"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
const TeacherWallet_1 = require("../models/TeacherWallet");
class WalletRepository {
    findByTeacherId(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TeacherWallet_1.TeacherWallet.findOne({ teacherId }).exec();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = new TeacherWallet_1.TeacherWallet(data);
            return yield doc.save();
        });
    }
    save(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wallet.save();
        });
    }
    // atomic credit: upsert wallet if missing and increment fields
    creditTeacherWallet(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { teacherId, amount } = params;
            if (amount <= 0)
                throw new Error("Invalid credit amount");
            const updated = yield TeacherWallet_1.TeacherWallet.findOneAndUpdate({ teacherId }, {
                $inc: { balance: amount, totalEarned: amount },
            }, { new: true, upsert: true, setDefaultsOnInsert: true }).exec();
            // return updated wallet (never null because of upsert)
            return updated;
        });
    }
    debitTeacherWallet(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { teacherId, amount } = params;
            if (amount <= 0)
                throw new Error("Invalid debit amount");
            // fetch and validate
            const wallet = yield TeacherWallet_1.TeacherWallet.findOne({ teacherId }).exec();
            if (!wallet)
                throw new Error("Wallet not found");
            if (wallet.balance < amount)
                throw new Error("Insufficient wallet balance");
            const updated = yield TeacherWallet_1.TeacherWallet.findOneAndUpdate({ teacherId }, {
                $inc: { balance: -amount, totalWithdrawn: amount },
            }, { new: true }).exec();
            return updated;
        });
    }
    deductBalance(teacherId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount <= 0)
                throw new Error("Invalid amount");
            // Atomic check and update
            const updated = yield TeacherWallet_1.TeacherWallet.findOneAndUpdate({ teacherId, balance: { $gte: amount } }, { $inc: { balance: -amount } }, { new: true }).exec();
            if (!updated) {
                // Check if it was existence or balance issue
                const exists = yield TeacherWallet_1.TeacherWallet.exists({ teacherId });
                if (!exists)
                    throw new Error("Wallet not found");
                throw new Error("Insufficient funds");
            }
            return updated;
        });
    }
    refundBalance(teacherId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount <= 0)
                throw new Error("Invalid amount");
            const updated = yield TeacherWallet_1.TeacherWallet.findOneAndUpdate({ teacherId }, { $inc: { balance: amount } }, { new: true }).exec();
            if (!updated)
                throw new Error("Wallet not found");
            return updated;
        });
    }
    recordSuccessfulWithdrawal(teacherId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount <= 0)
                throw new Error("Invalid amount");
            const updated = yield TeacherWallet_1.TeacherWallet.findOneAndUpdate({ teacherId }, { $inc: { totalWithdrawn: amount } }, { new: true }).exec();
            if (!updated)
                throw new Error("Wallet not found");
            return updated;
        });
    }
}
exports.WalletRepository = WalletRepository;
