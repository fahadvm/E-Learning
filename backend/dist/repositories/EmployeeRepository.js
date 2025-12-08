"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.EmployeeRepository = void 0;
const inversify_1 = require("inversify");
const Employee_1 = require("../models/Employee");
const Course_1 = require("../models/Course");
const ResANDError_1 = require("../utils/ResANDError");
const ResponseMessages_1 = require("../utils/ResponseMessages");
const mongoose_1 = __importStar(require("mongoose"));
const HttpStatuscodes_1 = require("../utils/HttpStatuscodes");
const EmployeeLearningRecord_1 = require("../models/EmployeeLearningRecord");
let EmployeeRepository = class EmployeeRepository {
    create(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.create(employee);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findOne({ email }).lean().exec();
        });
    }
    updateByEmail(email, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findOneAndUpdate({ email }, { $set: updateData }, { new: true })
                .lean()
                .exec();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.find().lean().exec();
        });
    }
    findById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findById(employeeId).lean().exec();
        });
    }
    getAssignedCourses(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield Employee_1.Employee.findById(employeeId)
                .populate("coursesAssigned")
                .lean();
            return employee;
        });
    }
    getTotalMinutes(employeeId, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield EmployeeLearningRecord_1.EmployeeLearningRecord.aggregate([
                { $match: { employeeId: new mongoose_1.default.Types.ObjectId(employeeId), companyId: new mongoose_1.default.Types.ObjectId(companyId) } },
                { $group: { _id: null, total: { $sum: "$totalMinutes" } } }
            ]);
            return result.length > 0 ? result[0].total : 0;
        });
    }
    findByCompanyId(companyId_1, skip_1, limit_1, search_1) {
        return __awaiter(this, arguments, void 0, function* (companyId, skip, limit, search, sortField = 'createdAt', sortOrder = 'desc') {
            const query = {
                companyId,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
            const sort = {};
            sort[sortField] = sortOrder === 'asc' ? 1 : -1;
            return yield Employee_1.Employee.find(query).sort(sort).skip(skip).limit(limit).lean().exec();
        });
    }
    getEmployeesByCompany(companyId, skip, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                companyId,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
            return yield Employee_1.Employee.find(query).skip(skip).limit(limit).lean().exec();
        });
    }
    countEmployeesByCompany(companyId, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { companyId };
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            return yield Employee_1.Employee.countDocuments(query);
        });
    }
    updateById(employeeId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("update data from service ", data);
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, data, { new: true }).lean().exec();
        });
    }
    updateCancelRequestById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, {
                status: 'none',
                $unset: { requestedCompanyId: '' },
            });
        });
    }
    // async updateRemoveCompanyById(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
    //     return await Employee.updateById(employeeId, {
    //         status: "notRequest",
    //         $unset: { requestedCompanyId: "" },
    //     });
    // }
    blockEmployee(employeeId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, { isBlocked: status }, { new: true })
                .lean()
                .exec();
        });
    }
    findByGoogleId(googleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findOne({ googleId }).lean().exec();
        });
    }
    findCompanyByEmployeeId(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield Employee_1.Employee.findById(employeeId)
                .populate("companyId")
                .populate("requestedCompanyId")
                .exec();
            return employee;
        });
    }
    findRequestedCompanyByEmployeeId(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findById(employeeId).populate('requestedCompanyId').lean().exec();
        });
    }
    findRequestedEmployees(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.find({
                requestedCompanyId: companyId,
                status: 'requested',
            });
        });
    }
    findEmployeeAndApprove(companyId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, {
                status: 'approved',
                companyId,
                $unset: { requestedCompanyId: '' },
            });
        });
    }
    findEmployeeAndReject(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, {
                status: 'none',
                $unset: { requestedCompanyId: '' },
            });
        });
    }
    assignCourseToEmployee(courseId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const employee = yield Employee_1.Employee.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND);
            const courseExists = yield Course_1.Course.exists({ _id: courseId });
            if (!courseExists)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND);
            const alreadyAssigned = (_a = employee.coursesAssigned) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === courseId.toString());
            if (alreadyAssigned)
                return;
            yield Employee_1.Employee.updateOne({ _id: employeeId }, { $push: { coursesAssigned: courseId } });
        });
    }
    updateEmployeeProgress(employeeId, courseId, lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(employeeId) || !mongoose_1.Types.ObjectId.isValid(courseId) || !mongoose_1.Types.ObjectId.isValid(lessonId))
                throw new Error('Invalid ID');
            const student = yield Employee_1.Employee.findById(employeeId);
            if (!student)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const course = yield Course_1.Course.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            let progress = student.coursesProgress.find(p => p.courseId.toString() === courseId);
            if (!progress) {
                progress = { courseId: new mongoose_1.Types.ObjectId(courseId), completedLessons: [], completedModules: [], percentage: 0, lastVisitedLesson: undefined, lastVisitedTime: new Date(), notes: '' };
                student.coursesProgress.push(progress);
            }
            if (!progress.completedLessons.includes(lessonId))
                progress.completedLessons.push(lessonId);
            progress.lastVisitedLesson = lessonId;
            progress.lastVisitedTime = new Date();
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
    getOrCreateCourseProgress(employeeId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield Employee_1.Employee.findById(employeeId);
            if (!student)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            let progress = student.coursesProgress.find(p => p.courseId.toString() === courseId);
            if (!progress) {
                progress = { courseId: new mongoose_1.Types.ObjectId(courseId), completedLessons: [], completedModules: [], percentage: 0, lastVisitedLesson: undefined, lastVisitedTime: new Date(), notes: '' };
                student.coursesProgress.push(progress);
                yield student.save();
            }
            return progress;
        });
    }
    saveNotes(employeeId, courseId, notes) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield Employee_1.Employee.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            let courseProgress = employee.coursesProgress.find(p => p.courseId.toString() === courseId);
            if (!courseProgress) {
                courseProgress = { courseId: new mongoose_1.Types.ObjectId(courseId), completedLessons: [], completedModules: [], percentage: 0, lastVisitedLesson: undefined, notes: notes };
                employee.coursesProgress.push(courseProgress);
            }
            else {
                courseProgress.notes = notes;
            }
            yield employee.save();
            return courseProgress;
        });
    }
    updateLearningTime(employeeId, courseId, date, roundedHours) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = yield EmployeeLearningRecord_1.EmployeeLearningRecord.findOneAndUpdate({
                employeeId,
                date,
                "courses.courseId": new mongoose_1.Types.ObjectId(courseId)
            }, {
                $inc: {
                    "courses.$.minutes": roundedHours,
                    totalMinutes: roundedHours
                }
            }, { new: true });
            if (!record) {
                record = yield EmployeeLearningRecord_1.EmployeeLearningRecord.findOneAndUpdate({ employeeId, date }, {
                    $inc: { totalMinutes: roundedHours },
                    $setOnInsert: { employeeId, date },
                    $push: { courses: { courseId: new mongoose_1.Types.ObjectId(courseId), minutes: roundedHours } },
                }, { new: true, upsert: true });
            }
            if (!record)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.RECORD_CREATION_FAILED);
            return record;
        });
    }
    getLearningRecords(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EmployeeLearningRecord_1.EmployeeLearningRecord.find({ employeeId })
                .populate("courses.courseId", "title duration")
                .sort({ updatedAt: -1 })
                .lean();
        });
    }
    getProgress(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield Employee_1.Employee.findById(employeeId)
                .populate("coursesProgress.courseId", "title duration")
                .lean();
            if (!employee)
                return null;
            return employee.coursesProgress || [];
        });
    }
    updateLoginStreak(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield Employee_1.Employee.findById(employeeId);
            if (!employee)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.EMPLOYEE_NOT_FOUND);
            const today = new Date();
            const lastLogin = employee.lastLoginDate ? new Date(employee.lastLoginDate) : null;
            const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
            if (!lastLogin) {
                employee.streakCount = 1;
            }
            else {
                const todayStart = normalizeDate(today);
                const lastLoginStart = normalizeDate(lastLogin);
                const diffDays = Math.floor((todayStart.getTime() - lastLoginStart.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    employee.streakCount += 1;
                }
                else if (diffDays > 1) {
                    employee.streakCount = 1;
                }
            }
            employee.lastLoginDate = today;
            if (employee.streakCount > employee.longestStreak) {
                employee.longestStreak = employee.streakCount;
            }
            yield employee.save();
            return {
                streakCount: employee.streakCount,
                longestStreak: employee.longestStreak,
            };
        });
    }
    searchByEmailOrName(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            }).lean().exec();
        });
    }
};
exports.EmployeeRepository = EmployeeRepository;
exports.EmployeeRepository = EmployeeRepository = __decorate([
    (0, inversify_1.injectable)()
], EmployeeRepository);
