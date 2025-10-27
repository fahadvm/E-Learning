"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.CompanyRepository = void 0;
const inversify_1 = require("inversify");
const Company_1 = require("../models/Company");
let CompanyRepository = class CompanyRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return Company_1.Company.findOne({ email }).exec();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = new Company_1.Company(data);
            return company.save();
        });
    }
    updatePassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Company_1.Company.updateOne({ email }, { password: newPassword }).exec();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return Company_1.Company.find().exec();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Company_1.Company.findById(id)
                .populate({
                path: 'employees',
                select: 'name email position isblocked _id',
            })
                .exec();
        });
    }
    updateById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return Company_1.Company.findByIdAndUpdate(id, data, { new: true }).exec();
        });
    }
    getAllCompanies(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = search
                ? { name: { $regex: search, $options: 'i' } }
                : {};
            return Company_1.Company.find(query)
                .populate({
                path: 'employees',
                select: 'name email',
            })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();
        });
    }
    countCompanies(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = search
                ? { name: { $regex: search, $options: 'i' } }
                : {};
            return Company_1.Company.countDocuments(query).exec();
        });
    }
    countUnverifiedCompanies(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                isVerified: false,
                status: 'pending',
            };
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }
            return Company_1.Company.countDocuments(query).exec();
        });
    }
    getUnverifiedCompanies(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                isVerified: false,
                status: 'pending',
            };
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }
            return Company_1.Company.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();
        });
    }
    verifyCompany(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Company_1.Company.findByIdAndUpdate(companyId, { isVerified: true, status: 'verified' }, { new: true }).exec();
        });
    }
    rejectCompany(companyId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return Company_1.Company.findByIdAndUpdate(companyId, { status: 'rejected', rejectReason: reason }, { new: true }).exec();
        });
    }
    blockCompany(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Company_1.Company.findByIdAndUpdate(companyId, { isBlocked: true }, { new: true }).exec();
        });
    }
    unblockCompany(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Company_1.Company.findByIdAndUpdate(companyId, { isBlocked: false }, { new: true }).exec();
        });
    }
    approveAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Company_1.Company.updateMany({ status: 'pending', isVerified: false }, { $set: { status: 'verified', isVerified: true, rejectionReason: null } }).exec();
            return { modifiedCount: result.modifiedCount };
        });
    }
    rejectAll(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Company_1.Company.updateMany({ status: 'pending', isVerified: false }, { $set: { status: 'rejected', isVerified: false, rejectReason: reason } }).exec();
            return { modifiedCount: result.modifiedCount };
        });
    }
    findByCompanyCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return Company_1.Company.findOne({ companyCode: code }).exec();
        });
    }
};
exports.CompanyRepository = CompanyRepository;
exports.CompanyRepository = CompanyRepository = __decorate([
    (0, inversify_1.injectable)()
], CompanyRepository);
