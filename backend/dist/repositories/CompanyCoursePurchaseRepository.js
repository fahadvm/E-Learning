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
exports.CompanyCoursePurchaseRepository = void 0;
const CompanyCoursePurchase_1 = __importDefault(require("../models/CompanyCoursePurchase"));
class CompanyCoursePurchaseRepository {
    purchaseCourse(companyId, courseId, seats) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield CompanyCoursePurchase_1.default.findOne({ companyId, courseId });
            if (existing) {
                existing.seatsPurchased += seats;
                return existing.save();
            }
            return CompanyCoursePurchase_1.default.create({
                companyId,
                courseId,
                seatsPurchased: seats,
                seatsUsed: 0,
            });
        });
    }
    /* 🔵 Increase Seat Usage (Assign Learning Path to Employee) */
    increaseSeatUsage(companyId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield CompanyCoursePurchase_1.default.findOne({ companyId, courseId });
            if (!record)
                throw new Error("Course not purchased");
            if (record.seatsUsed >= record.seatsPurchased) {
                throw new Error("No seats available");
            }
            record.seatsUsed += 1;
            return record.save();
        });
    }
    /* 🔻 Decrease Seat Usage (Unassign employee OR remove employee) */
    decreaseSeatUsage(companyId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield CompanyCoursePurchase_1.default.findOne({ companyId, courseId });
            if (!record)
                return null;
            if (record.seatsUsed > 0)
                record.seatsUsed -= 1;
            return record.save();
        });
    }
    /*   Get Single Course Usage */
    getCourseUsage(companyId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return CompanyCoursePurchase_1.default.findOne({ companyId, courseId });
        });
    }
    /*   Get All Company Purchases */
    getAllPurchasesByCompany(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return CompanyCoursePurchase_1.default.find({ companyId }).populate("courseId");
        });
    }
}
exports.CompanyCoursePurchaseRepository = CompanyCoursePurchaseRepository;
