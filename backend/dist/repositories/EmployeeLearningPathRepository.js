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
exports.EmployeeLearningPathRepository = void 0;
// src/repositories/EmployeeLearningPathRepository.ts
const inversify_1 = require("inversify");
const EmployeeLearningPath_1 = require("../models/EmployeeLearningPath");
const mongoose_1 = require("mongoose");
let EmployeeLearningPathRepository = class EmployeeLearningPathRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield EmployeeLearningPath_1.EmployeeLearningPath.create(data);
        });
    }
    findAll(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield EmployeeLearningPath_1.EmployeeLearningPath.find({ companyId: new mongoose_1.Types.ObjectId(companyId) })
                .sort({ createdAt: -1 })
                .lean()
                .exec();
        });
    }
    findOneForCompany(companyId, learningPathId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield EmployeeLearningPath_1.EmployeeLearningPath.findOne({
                _id: new mongoose_1.Types.ObjectId(learningPathId),
                companyId: new mongoose_1.Types.ObjectId(companyId),
            }).lean().exec();
        });
    }
    updateById(id, companyId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield EmployeeLearningPath_1.EmployeeLearningPath.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(id), companyId: new mongoose_1.Types.ObjectId(companyId) }, { $set: data }, { new: true }).lean().exec();
        });
    }
    deleteById(id, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield EmployeeLearningPath_1.EmployeeLearningPath.findOneAndDelete({
                _id: new mongoose_1.Types.ObjectId(id),
                companyId: new mongoose_1.Types.ObjectId(companyId),
            }).lean().exec();
        });
    }
    listByCompany(companyId, skip, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { companyId: new mongoose_1.Types.ObjectId(companyId) };
            if (search) {
                query['$or'] = [
                    { title: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                ];
            }
            return EmployeeLearningPath_1.EmployeeLearningPath.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec();
        });
    }
    countByCompany(companyId, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { companyId: new mongoose_1.Types.ObjectId(companyId) };
            if (search) {
                query['$or'] = [
                    { title: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                ];
            }
            return EmployeeLearningPath_1.EmployeeLearningPath.countDocuments(query).exec();
        });
    }
};
exports.EmployeeLearningPathRepository = EmployeeLearningPathRepository;
exports.EmployeeLearningPathRepository = EmployeeLearningPathRepository = __decorate([
    (0, inversify_1.injectable)()
], EmployeeLearningPathRepository);
