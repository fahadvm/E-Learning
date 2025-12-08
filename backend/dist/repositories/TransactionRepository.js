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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const Transaction_1 = require("../models/Transaction");
const mongoose_1 = __importDefault(require("mongoose"));
class TransactionRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = new Transaction_1.Transaction(data);
            return yield doc.save();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Transaction_1.Transaction.findById(id).exec();
        });
    }
    find(filter_1) {
        return __awaiter(this, arguments, void 0, function* (filter, options = {}) {
            const query = Transaction_1.Transaction.find(filter);
            if (options.sort)
                query.sort(options.sort);
            if (options.skip)
                query.skip(options.skip);
            if (options.limit)
                query.limit(options.limit);
            return yield query.exec();
        });
    }
    teacherEarnings(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Transaction_1.Transaction.aggregate([
                {
                    $match: {
                        teacherId: new mongoose_1.default.Types.ObjectId(teacherId),
                        type: "TEACHER_EARNING",
                        txnNature: "CREDIT",
                        paymentStatus: "SUCCESS"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalEarnings: { $sum: "$amount" }
                    }
                }
            ]);
            return result.length > 0 ? result[0].totalEarnings : 0;
        });
    }
    count(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Transaction_1.Transaction.countDocuments(filter).exec();
        });
    }
}
exports.TransactionRepository = TransactionRepository;
