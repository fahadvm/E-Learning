"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminStudentService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const Admin_student_Dto_1 = require("../../core/dtos/admin/Admin.student.Dto");
let AdminStudentService = class AdminStudentService {
    constructor(_studentRepo, _orderRepo, _subscriptionRepo) {
        this._studentRepo = _studentRepo;
        this._orderRepo = _orderRepo;
        this._subscriptionRepo = _subscriptionRepo;
    }
    getAllStudents(page, limit, search, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const students = yield this._studentRepo.findAll(skip, limit, search, status);
            const total = yield this._studentRepo.count(search, status);
            const formatted = [];
            for (const student of students) {
                const orders = yield this._orderRepo.getOrdersByStudentId(student._id.toString());
                const courseCount = orders.flatMap((o) => o.courses).length;
                const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);
                formatted.push((0, Admin_student_Dto_1.adminStudentListDto)(Object.assign(Object.assign({}, student), { courseCount,
                    totalSpent })));
            }
            return { data: formatted, total };
        });
    }
    getStudentById(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield this._studentRepo.findById(studentId);
            if (!student)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.STUDENT_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const orders = yield this._orderRepo.getOrdersByStudentId(studentId);
            const courses = orders.flatMap((o) => o.courses || []);
            const purchases = orders;
            console.log();
            return (0, Admin_student_Dto_1.adminStudentDetailsDto)({
                student,
                courses,
                purchases
            });
        });
    }
    blockStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._studentRepo.update(studentId, { isBlocked: true });
            return (0, Admin_student_Dto_1.adminStudentListDto)(updated);
        });
    }
    unblockStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._studentRepo.update(studentId, { isBlocked: false });
            return (0, Admin_student_Dto_1.adminStudentListDto)(updated);
        });
    }
};
exports.AdminStudentService = AdminStudentService;
exports.AdminStudentService = AdminStudentService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.StudentRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.OrderRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.SubscriptionPlanRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminStudentService);
