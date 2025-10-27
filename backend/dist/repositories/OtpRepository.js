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
exports.OtpRepository = void 0;
const Otp_1 = require("../models/Otp");
class OtpRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Otp_1.Otp.create(data);
        });
    }
    findByEmail(email, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const query = {
                email,
                expiresAt: { $gt: now },
            };
            if (purpose)
                query.purpose = purpose;
            return yield Otp_1.Otp.findOne(query).lean();
        });
    }
    deleteByEmail(email, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { email };
            if (purpose)
                query.purpose = purpose;
            yield Otp_1.Otp.deleteOne(query);
        });
    }
    updateOtp(email, otp, expiresAt, purpose, tempUserData) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { email };
            if (purpose)
                query.purpose = purpose;
            yield Otp_1.Otp.updateOne(query, {
                $set: Object.assign({ otp,
                    expiresAt }, (tempUserData && { tempUserData })),
            });
        });
    }
}
exports.OtpRepository = OtpRepository;
