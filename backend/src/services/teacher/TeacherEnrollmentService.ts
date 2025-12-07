import { injectable, inject } from "inversify";
import { ITransactionRepository } from "../../core/interfaces/repositories/ITransactionRepository";
import { ICompanyOrderRepository } from "../../core/interfaces/repositories/ICompanyOrderRepository";
import { TYPES } from "../../core/di/types";
import { Transaction } from "../../models/Transaction";
import mongoose from "mongoose";

@injectable()
export class TeacherEnrollmentService {
    constructor(
        // @inject(TYPES.TransactionRepository) private transactionRepository: ITransactionRepository,
        // @inject(TYPES.CompanyOrderRepository) private companyOrderRepository: ICompanyOrderRepository
    ) { }

    async getEnrollments(teacherId: string) {
        // === 1. INDIVIDUAL STUDENT ENROLLMENTS FROM ORDER MODEL === //
        const individualRaw = await mongoose.model("Order").aggregate([
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
            { $unwind: "$courses" },   // expand each course

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
                    "course.teacherId": new mongoose.Types.ObjectId(teacherId)
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
        const formattedIndividual = individualRaw.map((e: any) => {
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
        const companyEnrollmentsRaw = await mongoose.model('CompanyOrder').aggregate([
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
                    "course.teacherId": new mongoose.Types.ObjectId(teacherId),
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
    }

}
