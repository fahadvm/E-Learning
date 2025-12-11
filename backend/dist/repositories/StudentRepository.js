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
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const Course_1 = require("../models/Course");
const Student_1 = require("../models/Student");
const HttpStatuscodes_1 = require("../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../utils/ResponseMessages");
const ResANDError_1 = require("../utils/ResANDError");
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
    findAll(skip, limit, search, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (search)
                filter.name = { $regex: search, $options: 'i' };
            if (status === 'blocked')
                filter.isBlocked = true;
            if (status === 'active')
                filter.isBlocked = false;
            return Student_1.Student.find(filter).skip(skip).limit(limit).lean().exec();
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
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
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
    count(search, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (search)
                filter.name = { $regex: search, $options: 'i' };
            if (status === 'blocked')
                filter.isBlocked = true;
            if (status === 'active')
                filter.isBlocked = false;
            return Student_1.Student.countDocuments(filter);
        });
    }
    updateStudentProgress(studentId, courseId, lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(studentId) || !mongoose_1.Types.ObjectId.isValid(courseId) || !mongoose_1.Types.ObjectId.isValid(lessonId))
                throw new Error('Invalid ID');
            const student = yield Student_1.Student.findById(studentId);
            if (!student)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const course = yield Course_1.Course.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            let progress = student.coursesProgress.find(p => p.courseId.toString() === courseId);
            if (!progress) {
                progress = { courseId: new mongoose_1.Types.ObjectId(courseId), completedLessons: [], completedModules: [], percentage: 0, lastVisitedLesson: undefined, notes: '' };
                student.coursesProgress.push(progress);
            }
            if (!progress.completedLessons.includes(lessonId))
                progress.completedLessons.push(lessonId);
            progress.lastVisitedLesson = lessonId;
            const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
            const completedLessons = progress.completedLessons.length;
            progress.percentage = Math.min((completedLessons / totalLessons) * 100, 100);
            const completedModuleIds = [];
            for (const module of course.modules) {
                const moduleLessons = module.lessons.map(l => l._id.toString());
                if (moduleLessons.every(id => progress.completedLessons.includes(id))) {
                    const moduleId = module._id.toString();
                    if (!progress.completedModules.includes(moduleId))
                        completedModuleIds.push(moduleId);
                }
            }
            progress.completedModules = completedModuleIds;
            yield student.save({ validateBeforeSave: true });
            return progress;
        });
    }
    getOrCreateCourseProgress(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield Student_1.Student.findById(studentId);
            if (!student)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            let progress = student.coursesProgress.find(p => p.courseId.toString() === courseId);
            if (!progress) {
                progress = { courseId: new mongoose_1.Types.ObjectId(courseId), completedLessons: [], completedModules: [], percentage: 0, lastVisitedLesson: undefined, notes: '' };
                student.coursesProgress.push(progress);
                yield student.save();
            }
            return progress;
        });
    }
    saveNotes(studentId, courseId, notes) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield Student_1.Student.findById(studentId);
            if (!student)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            let courseProgress = student.coursesProgress.find(p => p.courseId.toString() === courseId);
            if (!courseProgress) {
                courseProgress = { courseId: new mongoose_1.Types.ObjectId(courseId), completedLessons: [], completedModules: [], percentage: 0, lastVisitedLesson: undefined, notes: notes };
                student.coursesProgress.push(courseProgress);
            }
            else {
                courseProgress.notes = notes;
            }
            yield student.save();
            return courseProgress;
        });
    }
};
exports.StudentRepository = StudentRepository;
exports.StudentRepository = StudentRepository = __decorate([
    (0, inversify_1.injectable)()
], StudentRepository);
