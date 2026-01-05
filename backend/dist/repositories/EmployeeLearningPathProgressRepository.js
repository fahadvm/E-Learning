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
exports.EmployeeLearningPathProgressRepository = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const EmployeeLearningPathProgress_1 = require("../models/EmployeeLearningPathProgress");
const EmployeeLearningPath_1 = require("../models/EmployeeLearningPath");
let EmployeeLearningPathProgressRepository = class EmployeeLearningPathProgressRepository {
    findAssigned(companyId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.find({
                companyId: new mongoose_1.Types.ObjectId(companyId),
                employeeId: new mongoose_1.Types.ObjectId(employeeId),
            })
                .populate('learningPathId')
                .lean()
                .exec();
        });
    }
    findAllAssignedEmployees(companyId, learningPathId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.find({ companyId, learningPathId }, { employeeId: 1, _id: 0 });
        });
    }
    getAssigned(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.find({
                employeeId: new mongoose_1.Types.ObjectId(employeeId),
            })
                .populate('learningPathId')
                .lean()
                .exec();
        });
    }
    findOne(companyId, employeeId, learningPathId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.findOne({
                companyId: new mongoose_1.Types.ObjectId(companyId),
                employeeId: new mongoose_1.Types.ObjectId(employeeId),
                learningPathId: new mongoose_1.Types.ObjectId(learningPathId),
            })
                .lean()
                .exec();
        });
    }
    create(companyId, employeeId, learningPathId) {
        return __awaiter(this, void 0, void 0, function* () {
            const learningPath = yield EmployeeLearningPath_1.EmployeeLearningPath
                .findById(learningPathId)
                .select('courses');
            if (!learningPath || learningPath.courses.length === 0) {
                throw new Error('Learning path has no courses');
            }
            const firstCourse = learningPath.courses[0];
            const doc = yield EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.create({
                companyId: new mongoose_1.Types.ObjectId(companyId),
                employeeId: new mongoose_1.Types.ObjectId(employeeId),
                learningPathId: new mongoose_1.Types.ObjectId(learningPathId),
                status: 'active',
                percentage: 0, // learning path %
                completedCourses: [],
                currentCourse: {
                    index: 0,
                    courseId: firstCourse.courseId,
                    percentage: 0, // progress of first course
                }
            });
            return doc.toObject();
        });
    }
    delete(companyId, employeeId, learningPathId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.findOneAndDelete({
                companyId: new mongoose_1.Types.ObjectId(companyId),
                employeeId: new mongoose_1.Types.ObjectId(employeeId),
                learningPathId: new mongoose_1.Types.ObjectId(learningPathId),
            }).exec();
        });
    }
    get(employeeId, learningPathId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.findOne({
                employeeId: new mongoose_1.Types.ObjectId(employeeId),
                learningPathId: new mongoose_1.Types.ObjectId(learningPathId),
            })
                .lean()
                .exec();
        });
    }
    updateLearningPathProgress(employeeId, courseId, percentage) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield EmployeeLearningPathProgress_1.EmployeeLearningPathProgress
                .findOne({
                employeeId: new mongoose_1.Types.ObjectId(employeeId),
                'currentCourse.courseId': new mongoose_1.Types.ObjectId(courseId)
            })
                .populate('learningPathId');
            if (!progress)
                throw new Error('Progress record not found');
            const learningPath = progress.learningPathId;
            const totalCourses = learningPath.courses.length;
            progress.currentCourse.percentage = percentage;
            if (progress.currentCourse.percentage >= 100) {
                const finishedCourseId = progress.currentCourse.courseId;
                if (!progress.completedCourses.includes(finishedCourseId)) {
                    progress.completedCourses.push(finishedCourseId);
                }
                progress.currentCourse.index += 1;
                if (progress.currentCourse.index < totalCourses) {
                    progress.currentCourse.courseId = learningPath.courses[progress.currentCourse.index].courseId;
                    progress.currentCourse.percentage = 0;
                }
                else {
                    progress.status = 'completed';
                    progress.percentage = 100;
                    const finalSave = yield progress.save();
                    return finalSave.toObject();
                }
            }
            progress.percentage = Math.floor((progress.completedCourses.length / totalCourses) * 100);
            const saved = yield progress.save();
            return saved.toObject();
        });
    }
    countAssignedSeats(companyId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all learning paths that contain this course
            const learningPaths = yield EmployeeLearningPath_1.EmployeeLearningPath.find({
                companyId: new mongoose_1.Types.ObjectId(companyId),
                'courses.courseId': new mongoose_1.Types.ObjectId(courseId)
            }).select('_id');
            const learningPathIds = learningPaths.map(lp => lp._id);
            // Count unique employees who have been assigned any learning path containing this course
            const uniqueEmployees = yield EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.distinct('employeeId', {
                companyId: new mongoose_1.Types.ObjectId(companyId),
                learningPathId: { $in: learningPathIds }
            });
            return uniqueEmployees.length;
        });
    }
    findByEmployeeId(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.findOne({
                employeeId: new mongoose_1.Types.ObjectId(employeeId)
            })
                .lean()
                .exec();
        });
    }
};
exports.EmployeeLearningPathProgressRepository = EmployeeLearningPathProgressRepository;
exports.EmployeeLearningPathProgressRepository = EmployeeLearningPathProgressRepository = __decorate([
    (0, inversify_1.injectable)()
], EmployeeLearningPathProgressRepository);
