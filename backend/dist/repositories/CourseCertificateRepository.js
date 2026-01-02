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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCertificateRepository = void 0;
const inversify_1 = require("inversify");
const CourseCertificate_1 = __importDefault(require("../models/CourseCertificate"));
const mongoose_1 = require("mongoose");
let CourseCertificateRepository = class CourseCertificateRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CourseCertificate_1.default.create(data);
        });
    }
    findByStudentCourse(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CourseCertificate_1.default.findOne({ studentId, courseId });
        });
    }
    findByStudent(studentId, page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const query = { studentId: new mongoose_1.Types.ObjectId(studentId) };
            if (search) {
                query.$or = [
                    { certificateNumber: { $regex: search, $options: 'i' } }
                ];
                // Note: searching by populated field like 'courseId.title' doesn't work directly in find()
            }
            const certificates = yield CourseCertificate_1.default
                .find(query)
                .populate('courseId', 'title coverImage')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = yield CourseCertificate_1.default.countDocuments(query);
            return { certificates, total };
        });
    }
    findOneByCourseId(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CourseCertificate_1.default.findOne({
                courseId,
                studentId,
            }).populate('courseId', 'title coverImage');
        });
    }
};
exports.CourseCertificateRepository = CourseCertificateRepository;
exports.CourseCertificateRepository = CourseCertificateRepository = __decorate([
    (0, inversify_1.injectable)()
], CourseCertificateRepository);
