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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.CompanyLearningPathService = void 0;
// src/services/company/CompanyLearningPathService.ts
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const mongoose_1 = __importDefault(require("mongoose"));
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResANDError_1 = require("../../utils/ResANDError");
let CompanyLearningPathService = class CompanyLearningPathService {
    constructor(_repo, _assignRepo, _purchaseRepo, _notificationService, _companyRepo) {
        this._repo = _repo;
        this._assignRepo = _assignRepo;
        this._purchaseRepo = _purchaseRepo;
        this._notificationService = _notificationService;
        this._companyRepo = _companyRepo;
    }
    create(companyId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.title || !data.category || !data.difficulty) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_DATA, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const courses = (data.courses || []).map((c, idx) => (Object.assign(Object.assign({}, c), { order: idx, locked: idx !== 0 })));
            return yield this._repo.create(Object.assign(Object.assign({}, data), { companyId: new mongoose_1.default.Types.ObjectId(companyId), courses }));
        });
    }
    getAll(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repo.findAll(companyId);
        });
    }
    getOne(id, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lp = yield this._repo.findOneForCompany(companyId, id);
            if (!lp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return lp;
        });
    }
    update(id, companyId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // re-apply locking/order if courses provided
            if (data.courses && data.courses.length) {
                data.courses = data.courses.map((c, idx) => (Object.assign(Object.assign({}, c), { order: typeof c.order === 'number' ? c.order : idx, locked: idx !== 0 })));
            }
            const updated = yield this._repo.updateById(id, companyId, data);
            if (!updated)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return updated;
        });
    }
    delete(id, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lp = yield this._repo.findOneForCompany(companyId, id);
            if (!lp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            // Find all employees assigned to this learning path
            const assignments = yield this._assignRepo.findAllAssignedEmployees(companyId, id);
            //  Decrease seat usage for each employee
            for (const a of assignments) {
                for (const course of lp.courses) {
                    yield this._purchaseRepo.decreaseSeatUsage(new mongoose_1.default.Types.ObjectId(companyId), new mongoose_1.default.Types.ObjectId(course.courseId.toString()));
                }
                yield this._assignRepo.delete(companyId, a.employeeId.toString(), id);
            }
            const deleted = yield this._repo.deleteById(id, companyId);
            if (!deleted)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
        });
    }
    listCompanyLearningPaths(companyId_1, page_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (companyId, page, limit, search = "") {
            const skip = (page - 1) * limit;
            const [items, total] = yield Promise.all([
                this._repo.listByCompany(companyId, skip, limit, search),
                this._repo.countByCompany(companyId, search),
            ]);
            return { items, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
        });
    }
    listAssignedLearningPaths(companyId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const assigned = yield this._assignRepo.findAssigned(companyId, employeeId);
            return assigned;
        });
    }
    assignLearningPath(companyId, employeeId, learningPathId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lp = yield this._repo.findOneForCompany(companyId, learningPathId);
            if (!lp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.LEARNING_PATH_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            // prevent duplicates
            const exists = yield this._assignRepo.findOne(companyId, employeeId, learningPathId);
            if (exists)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.LEARNING_PATH_ALREADY_ASSIGNED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            // Check seat availability for all courses in the learning path
            const seatCheckResults = yield this.checkLearningPathSeats(companyId, lp);
            console.log("seatCheckResults", seatCheckResults);
            // If any course has insufficient seats, throw error with details
            const insufficientSeats = seatCheckResults.filter(result => result.remaining <= 0);
            if (insufficientSeats.length > 0) {
                const courseNames = insufficientSeats.map(r => r.courseName).join(', ');
                (0, ResANDError_1.throwError)(`Cannot assign learning path. The following courses have no available seats: ${courseNames}. Please purchase more seats.`, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            // Create progress with sequential rule (Option B): first course index = 0; UI locks others based on index
            const progress = yield this._assignRepo.create(companyId, employeeId, learningPathId);
            const company = yield this._companyRepo.findById(companyId);
            // Notify Employee
            yield this._notificationService.createNotification(employeeId, 'New Learning Path Assigned', `You have been assigned to the learning path: ${lp.title}.`, 'learning-path', 'employee', `/employee/learning-paths`);
            for (const course of lp.courses) {
                yield this._purchaseRepo.increaseSeatUsage(new mongoose_1.default.Types.ObjectId(companyId), new mongoose_1.default.Types.ObjectId(course.courseId.toString()));
                // Check if seat limit reached for this course
                const results = yield this.checkLearningPathSeats(companyId, lp);
                const thisCourseResult = results.find(r => r.courseId.toString() === course.courseId.toString());
                if (thisCourseResult && thisCourseResult.remaining <= 0) {
                    yield this._notificationService.createNotification(companyId, 'Seat Limit Reached', `Course "${course.title}" has reached its seat limit. Please buy more seats.`, 'seat-limit', 'company', '/company/courses');
                }
            }
            // Notify Company
            yield this._notificationService.createNotification(companyId, 'Learning Path Assigned', `${lp.title} has been assigned to an employee.`, 'learning-path', 'company', `/company/employees/${employeeId}`);
            return progress;
        });
    }
    checkLearningPathSeats(companyId, learningPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const { CompanyOrderModel } = yield Promise.resolve().then(() => __importStar(require('../../models/CompanyOrder')));
            const results = [];
            for (const course of learningPath.courses) {
                // Get total purchased seats for this course
                const orders = yield CompanyOrderModel.find({
                    companyId: new mongoose_1.default.Types.ObjectId(companyId),
                    status: 'paid',
                    'purchasedCourses.courseId': course.courseId
                });
                const totalSeats = orders.reduce((sum, order) => {
                    const purchasedCourse = order.purchasedCourses.find(pc => pc.courseId.toString() === course.courseId.toString());
                    return sum + ((purchasedCourse === null || purchasedCourse === void 0 ? void 0 : purchasedCourse.seats) || 0);
                }, 0);
                console.log("totalSeats:", totalSeats);
                // Get assigned seats - count unique employees who have this course in any learning path
                const assignedSeats = yield this._assignRepo.countAssignedSeats(companyId, course.courseId.toString());
                results.push({
                    courseId: course.courseId,
                    courseName: course.title,
                    totalSeats,
                    assignedSeats,
                    remaining: totalSeats - assignedSeats
                });
            }
            return results;
        });
    }
    unassignLearningPath(companyId, employeeId, learningPathId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(companyId, employeeId, learningPathId);
            const exists = yield this._assignRepo.findOne(companyId, employeeId, learningPathId);
            if (!exists)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.LEARNING_PATH_ASSIGNMENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            yield this._assignRepo.delete(companyId, employeeId, learningPathId);
            const lp = yield this._repo.findOneForCompany(companyId, learningPathId);
            if (!lp)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.LEARNING_PATH_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            // Notify Employee
            yield this._notificationService.createNotification(employeeId, 'Learning Path Removed', `The learning path "${lp.title}" has been unassigned from your account.`, 'learning-path', 'employee');
            // Notify Company
            yield this._notificationService.createNotification(companyId, 'Learning Path Unassigned', `Learning path "${lp.title}" has been unassigned from an employee.`, 'learning-path', 'company');
            for (const course of lp.courses) {
                yield this._purchaseRepo.decreaseSeatUsage(new mongoose_1.default.Types.ObjectId(companyId), new mongoose_1.default.Types.ObjectId(course.courseId.toString()));
            }
        });
    }
};
exports.CompanyLearningPathService = CompanyLearningPathService;
exports.CompanyLearningPathService = CompanyLearningPathService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.EmployeeLearningPathRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.EmployeeLearningPathProgressRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CompanyCoursePurchaseRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.NotificationService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CompanyLearningPathService);
