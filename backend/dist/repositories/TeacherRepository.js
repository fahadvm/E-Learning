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
exports.TeacherRepository = void 0;
const inversify_1 = require("inversify");
const Teacher_1 = require("../models/Teacher");
let TeacherRepository = class TeacherRepository {
    create(teacher) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.create(teacher);
        });
    }
    updateById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.findByIdAndUpdate(id, data, { new: true }).lean();
        });
    }
    findById(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.findById(teacherId).lean();
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.findOne(filter).lean();
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.findOne({ email }).lean();
        });
    }
    updateByEmail(email, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.findOneAndUpdate({ email }, updateData, { new: true }).lean();
        });
    }
    addProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.create(profile);
        });
    }
    editProfile(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.findByIdAndUpdate(id, data, { new: true }).lean();
        });
    }
    getProfileByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.findOne({ userId }).lean();
        });
    }
    findAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (params === null || params === void 0 ? void 0 : params.search) {
                query.$or = [
                    { name: { $regex: params.search, $options: 'i' } },
                    { email: { $regex: params.search, $options: 'i' } }
                ];
            }
            return Teacher_1.Teacher.find(query)
                .skip((params === null || params === void 0 ? void 0 : params.skip) || 0)
                .limit((params === null || params === void 0 ? void 0 : params.limit) || 0)
                .lean();
        });
    }
    count(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            return Teacher_1.Teacher.countDocuments(query);
        });
    }
    getUnverifiedTeachers() {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.find({ isVerified: false, isRejected: false }).lean();
        });
    }
    findUnverified() {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.find({ isVerified: false }).lean();
        });
    }
    verifyTeacherById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.findByIdAndUpdate(id, { isVerified: true, isRejected: false }, { new: true }).lean();
        });
    }
    rejectTeacherById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.findByIdAndUpdate(id, { isVerified: false, isRejected: true }, { new: true }).lean();
        });
    }
    updateStatus(teacherId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            return Teacher_1.Teacher.findByIdAndUpdate(teacherId, updates, { new: true }).lean();
        });
    }
};
exports.TeacherRepository = TeacherRepository;
exports.TeacherRepository = TeacherRepository = __decorate([
    (0, inversify_1.injectable)()
], TeacherRepository);
