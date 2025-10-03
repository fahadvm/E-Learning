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
exports.StudentRepository = void 0;
// repositories/student/StudentRepository.ts
const inversify_1 = require("inversify");
const Student_1 = require("../models/Student");
let StudentRepository = class StudentRepository {
    create(student) {
        return __awaiter(this, void 0, void 0, function* () {
            return Student_1.Student.create(student);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return Student_1.Student.findOne({ email }).lean().exec();
        });
    }
    findByGoogleId(googleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Student_1.Student.findOne({ googleId }).lean().exec();
        });
    }
    findAll(skip, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = search
                ? { name: { $regex: search, $options: 'i' } }
                : {};
            return Student_1.Student.find(filter)
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return Student_1.Student.findOne(filter).lean().exec();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Student_1.Student.findById(id).lean().exec();
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield Student_1.Student.findByIdAndUpdate(id, { $set: data }, { new: true }).lean().exec();
            if (!updated) {
                throw new Error('Student not found for update.');
            }
            return updated;
        });
    }
    updateByEmail(email, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return Student_1.Student.findOneAndUpdate({ email }, { $set: updateData }, { new: true }).lean().exec();
        });
    }
    updateProfile(studentId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            return Student_1.Student.findByIdAndUpdate(studentId, profileData, { new: true }).lean().exec();
        });
    }
    count(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = search
                ? { name: { $regex: search, $options: 'i' } }
                : {};
            return Student_1.Student.countDocuments(filter).exec();
        });
    }
};
exports.StudentRepository = StudentRepository;
exports.StudentRepository = StudentRepository = __decorate([
    (0, inversify_1.injectable)()
], StudentRepository);
