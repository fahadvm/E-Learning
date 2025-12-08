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
exports.TeacherEnrollmentService = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = __importDefault(require("mongoose"));
let TeacherEnrollmentService = class TeacherEnrollmentService {
    constructor(
    // @inject(TYPES.TransactionRepository) private transactionRepository: ITransactionRepository,
    // @inject(TYPES.CompanyOrderRepository) private companyOrderRepository: ICompanyOrderRepository
    ) { }
    getEnrollments(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            // === 1. INDIVIDUAL STUDENT ENROLLMENTS FROM ORDER MODEL === //
            const individualRaw = yield mongoose_1.default.model("Order").aggregate([
                {
                    $match: { status: "paid" }
                },
                {
                    $lookup: {
                        from: "students",
                        localField: "studentId",
                        foreignField: "_id",
                        as: "student"
                    }
                },
                { $unwind: "$student" },
                { $unwind: "$courses" }, // expand each course
                // Populate the course
                {
                    $lookup: {
                        from: "courses",
                        localField: "courses",
                        foreignField: "_id",
                        as: "course"
                    }
                },
                { $unwind: "$course" },
                // Filter courses that belong to this teacher
                {
                    $match: {
                        "course.teacherId": new mongoose_1.default.Types.ObjectId(teacherId)
                    }
                },
                // Extract Course Progress for this student
                {
                    $project: {
                        id: "$_id",
                        name: "$student.name",
                        email: "$student.email",
                        courseTitle: "$course.title",
                        enrolledAt: "$createdAt",
                        source: "individual",
                        // Filter course progress
                        progressObj: {
                            $filter: {
                                input: "$student.coursesProgress",
                                as: "cp",
                                cond: { $eq: ["$$cp.courseId", "$course._id"] }
                            }
                        }
                    }
                }
            ]);
            // Format result same as your UI
            const formattedIndividual = individualRaw.map((e) => {
                const prog = e.progressObj && e.progressObj[0];
                const percentage = prog ? prog.percentage : 0;
                const status = percentage === 100 ? "Completed" :
                    percentage > 0 ? "In Progress" :
                        "Not Started";
                return {
                    id: e.id,
                    name: e.name,
                    email: e.email,
                    courseTitle: e.courseTitle,
                    source: "individual",
                    enrolledAt: e.enrolledAt,
                    progress: percentage,
                    status
                };
            });
            // === 2. COMPANY ENROLLMENTS (Already Correct) === //
            const companyEnrollmentsRaw = yield mongoose_1.default.model('CompanyOrder').aggregate([
                { $unwind: "$purchasedCourses" },
                {
                    $lookup: {
                        from: "courses",
                        localField: "purchasedCourses.courseId",
                        foreignField: "_id",
                        as: "course"
                    }
                },
                { $unwind: "$course" },
                {
                    $match: {
                        "course.teacherId": new mongoose_1.default.Types.ObjectId(teacherId),
                        "status": "paid"
                    }
                },
                {
                    $lookup: {
                        from: "companies",
                        localField: "companyId",
                        foreignField: "_id",
                        as: "company"
                    }
                },
                { $unwind: "$company" },
                // 👉 LOOKUP ASSIGNED EMPLOYEES
                {
                    $lookup: {
                        from: "employeelearningpaths", // <-- CHANGE IF YOUR COLLECTION NAME IS DIFFERENT
                        let: { courseId: "$purchasedCourses.courseId", companyId: "$companyId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$courseId", "$$courseId"] },
                                            { $eq: ["$companyId", "$$companyId"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "assigned"
                    }
                },
                {
                    $project: {
                        id: "$_id",
                        companyName: "$company.name",
                        email: "$company.email",
                        courseTitle: "$course.title",
                        source: "company",
                        purchasedSeats: "$purchasedCourses.seats",
                        assignedSeats: { $size: "$assigned" },
                        enrolledAt: "$createdAt"
                    }
                }
            ]);
            // Merge both result arrays
            return [...formattedIndividual, ...companyEnrollmentsRaw];
        });
    }
};
exports.TeacherEnrollmentService = TeacherEnrollmentService;
exports.TeacherEnrollmentService = TeacherEnrollmentService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], TeacherEnrollmentService);
