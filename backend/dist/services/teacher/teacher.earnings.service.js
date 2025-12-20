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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherEarningsService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const mongoose_1 = __importDefault(require("mongoose"));
let TeacherEarningsService = class TeacherEarningsService {
    constructor(_transactionRepo, _walletRepo) {
        this._transactionRepo = _transactionRepo;
        this._walletRepo = _walletRepo;
    }
    getEarningsHistory(teacherId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, type, startDate, endDate } = filters;
            const skip = (page - 1) * limit;
            const query = {
                teacherId: new mongoose_1.default.Types.ObjectId(teacherId),
                paymentStatus: 'SUCCESS',
                txnNature: { $in: ['CREDIT', 'DEBIT'] },
                type: { $in: ['TEACHER_EARNING', 'TEACHER_WITHDRAWAL'] }
            };
            // Filter by source: Course or Call
            if (type === 'COURSE') {
                query.courseId = { $exists: true, $ne: null };
            }
            else if (type === 'CALL') {
                query.meetingId = { $exists: true, $ne: null };
            }
            // Proper date range (inclusive start, end of day)
            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) {
                    query.createdAt.$gte = new Date(startDate);
                    query.createdAt.$gte.setHours(0, 0, 0, 0);
                }
                if (endDate) {
                    query.createdAt.$lte = new Date(endDate);
                    query.createdAt.$lte.setHours(23, 59, 59, 999);
                }
            }
            const sort = { createdAt: -1 };
            const [data, total] = yield Promise.all([
                this._transactionRepo.find(query, { skip, limit, sort }),
                this._transactionRepo.count(query),
            ]);
            console.log("getting earnings", data);
            return {
                data,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1,
            };
        });
    }
    getEarningsStats(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this._walletRepo.findByTeacherId(teacherId);
            if (!wallet)
                return { balance: 0, totalEarned: 0, totalWithdrawn: 0 };
            return {
                balance: wallet.balance,
                totalEarned: wallet.totalEarned,
                totalWithdrawn: wallet.totalWithdrawn,
            };
        });
    }
};
exports.TeacherEarningsService = TeacherEarningsService;
exports.TeacherEarningsService = TeacherEarningsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.TransactionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.WalletRepository)),
    __metadata("design:paramtypes", [Object, Object])
], TeacherEarningsService);
