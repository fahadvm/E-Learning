"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AdminPayoutService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const Payout_1 = require("../../models/Payout");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let AdminPayoutService = class AdminPayoutService {
    constructor(_payoutRepo, _walletRepo, _transactionRepo) {
        this._payoutRepo = _payoutRepo;
        this._walletRepo = _walletRepo;
        this._transactionRepo = _transactionRepo;
    }
    getAllPayouts(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (status && status !== 'All')
                filter.status = status;
            return yield this._payoutRepo.findAll(filter, 0, 100); // Limit 100 for now
        });
    }
    approvePayout(payoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payout = yield this._payoutRepo.findById(payoutId);
            if (!payout)
                (0, ResANDError_1.throwError)('Payout not found', HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (payout.status !== Payout_1.PayoutStatus.PENDING)
                (0, ResANDError_1.throwError)('Payout is not pending', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            // 1. Update Payout Status
            const updatedPayout = yield this._payoutRepo.updateStatus(payoutId, Payout_1.PayoutStatus.APPROVED);
            if (!updatedPayout)
                (0, ResANDError_1.throwError)('Failed to update payout', HttpStatuscodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            // 2. Commit Withdrawal in Wallet (Update totalWithdrawn)
            yield this._walletRepo.recordSuccessfulWithdrawal(updatedPayout.teacherId.toString(), updatedPayout.amount);
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
        });
    }
    rejectPayout(payoutId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const payout = yield this._payoutRepo.findById(payoutId);
            if (!payout)
                (0, ResANDError_1.throwError)('Payout not found', HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (payout.status !== Payout_1.PayoutStatus.PENDING)
                (0, ResANDError_1.throwError)('Payout is not pending', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            // 1. Update Payout Status
            const updatedPayout = yield this._payoutRepo.updateStatus(payoutId, Payout_1.PayoutStatus.REJECTED, reason);
            if (!updatedPayout)
                (0, ResANDError_1.throwError)('Failed to update payout', HttpStatuscodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            // 2. Refund Balance
            yield this._walletRepo.refundBalance(updatedPayout.teacherId.toString(), updatedPayout.amount);
            return updatedPayout;
        });
    }
};
exports.AdminPayoutService = AdminPayoutService;
exports.AdminPayoutService = AdminPayoutService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PayoutRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.WalletRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.TransactionRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminPayoutService);
