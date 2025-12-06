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
        // 1. Fetch Individual Enrollments (Transactions)
        const individualEnrollments = await Transaction.aggregate([
            {
                $match: {
                    teacherId: new mongoose.Types.ObjectId(teacherId),
                    type: "COURSE_PURCHASE",
                    paymentStatus: "SUCCESS",
                    userId: { $exists: true }
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "userId",
                    foreignField: "_id",
                    as: "student"
                }
            },
            { $unwind: "$student" },
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "course"
                }
            },
            { $unwind: "$course" },
            {
                $project: {
                    id: "$_id",
                    name: "$student.name",
                    email: "$student.email",
                    courseTitle: "$course.title",
                    source: "individual",
                    enrolledAt: "$createdAt",
                    // Progress calculation (finding the specific course progress in the array)
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

        const formattedIndividual = individualEnrollments.map((e: any) => {
            const prog = e.progressObj && e.progressObj[0];
            const percentage = prog ? prog.percentage : 0;
            const status = percentage === 100 ? 'Completed' : (percentage > 0 ? 'In Progress' : 'Not Started');
            return {
                id: e.id,
                name: e.name,
                email: e.email,
                courseTitle: e.courseTitle,
                source: 'individual',
                enrolledAt: e.enrolledAt,
                progress: percentage,
                status: status
            };
        });

        // 2. Fetch Company Enrollments (CompanyOrders)
        // We need to find orders that contain courses belonging to this teacher.
        // This is a bit complex because orders contain multiple courses.

        // Value: We need to find CompanyOrders where purchasedCourses.courseId resolves to a course with this teacherId.
        const companyEnrollmentsRaw = await mongoose.model('CompanyOrder').aggregate([
            {
                $lookup: {
                    from: "courses",
                    localField: "purchasedCourses.courseId",
                    foreignField: "_id",
                    as: "courseDetails"
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
            // Filter to only include orders that have at least one course by this teacher
            // However, we want to flatten this: One row per Course per Order.
            { $unwind: "$purchasedCourses" },
            {
                $lookup: {
                    from: "courses",
                    localField: "purchasedCourses.courseId",
                    foreignField: "_id",
                    as: "populatedCourse"
                }
            },
            { $unwind: "$populatedCourse" },
            {
                $match: {
                    "populatedCourse.teacherId": new mongoose.Types.ObjectId(teacherId),
                    "status": "paid"
                }
            },
            {
                $project: {
                    id: "$_id",
                    companyName: "$company.name",
                    email: "$company.email",
                    courseTitle: "$populatedCourse.title",
                    source: "company",
                    purchasedSeats: "$purchasedCourses.seats",
                    // Assigned Seats: Placeholder for now, as it requires complex lookup into EmployeeLearningPath
                    assignedSeats: { $literal: 0 },
                    enrolledAt: "$createdAt"
                }
            }
        ]);

        return [...formattedIndividual, ...companyEnrollmentsRaw];
    }
}
