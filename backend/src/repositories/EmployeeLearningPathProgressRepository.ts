import { injectable } from "inversify";
import { Types } from "mongoose";
import { IEmployeeLearningPathProgressRepository } from "../core/interfaces/repositories/IEmployeeLearningPathProgressRepository";
import { EmployeeLearningPathProgress, IEmployeeLearningPathProgress } from "../models/EmployeeLearningPathProgress";
import { EmployeeLearningPath } from "../models/EmployeeLearningPath";

@injectable()
export class EmployeeLearningPathProgressRepository implements IEmployeeLearningPathProgressRepository {
    async findAssigned(companyId: string, employeeId: string): Promise<IEmployeeLearningPathProgress[]> {
        return EmployeeLearningPathProgress.find({
            companyId: new Types.ObjectId(companyId),
            employeeId: new Types.ObjectId(employeeId),
        })
            .populate("learningPathId")
            .lean()
            .exec();
    }

    async findAllAssignedEmployees(companyId: string, learningPathId: string) {
        return EmployeeLearningPathProgress.find(
            { companyId, learningPathId },
            { employeeId: 1, _id: 0 }
        );
    }

    async getAssigned(employeeId: string): Promise<IEmployeeLearningPathProgress[]> {
        return EmployeeLearningPathProgress.find({
            employeeId: new Types.ObjectId(employeeId),
        })
            .populate("learningPathId")
            .lean()
            .exec();
    }

    async findOne(companyId: string, employeeId: string, learningPathId: string): Promise<IEmployeeLearningPathProgress | null> {
        return EmployeeLearningPathProgress.findOne({
            companyId: new Types.ObjectId(companyId),
            employeeId: new Types.ObjectId(employeeId),
            learningPathId: new Types.ObjectId(learningPathId),
        })
            .lean()
            .exec();
    }

    async create(companyId: string, employeeId: string, learningPathId: string): Promise<IEmployeeLearningPathProgress> {

        const learningPath = await EmployeeLearningPath
            .findById(learningPathId)
            .select("courses");

        if (!learningPath || learningPath.courses.length === 0) {
            throw new Error("Learning path has no courses");
        }

        const firstCourse = learningPath.courses[0];

        const doc = await EmployeeLearningPathProgress.create({
            companyId: new Types.ObjectId(companyId),
            employeeId: new Types.ObjectId(employeeId),
            learningPathId: new Types.ObjectId(learningPathId),
            status: "active",
            percentage: 0, // learning path %
            completedCourses: [],

            currentCourse: {
                index: 0,
                courseId: firstCourse.courseId,
                percentage: 0, // progress of first course
            }
        });

        return doc.toObject() as IEmployeeLearningPathProgress;
    }
    async delete(companyId: string, employeeId: string, learningPathId: string): Promise<void> {
        await EmployeeLearningPathProgress.findOneAndDelete({
            companyId: new Types.ObjectId(companyId),
            employeeId: new Types.ObjectId(employeeId),
            learningPathId: new Types.ObjectId(learningPathId),
        }).exec();
    }

    async get(employeeId: string, learningPathId: string): Promise<IEmployeeLearningPathProgress | null> {
        return EmployeeLearningPathProgress.findOne({
            employeeId: new Types.ObjectId(employeeId),
            learningPathId: new Types.ObjectId(learningPathId),
        })
            .lean()
            .exec();
    }

    async updateLearningPathProgress(employeeId: string, courseId: string, percentage: number): Promise<IEmployeeLearningPathProgress> {
        const progress = await EmployeeLearningPathProgress
            .findOne({
                employeeId: new Types.ObjectId(employeeId),
                "currentCourse.courseId": new Types.ObjectId(courseId)
            })
            .populate("learningPathId");

        if (!progress) throw new Error("Progress record not found");

        const learningPath = progress.learningPathId as any;
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
            } else {
                progress.status = "completed";
                progress.percentage = 100;
                const finalSave = await progress.save();
                return finalSave.toObject();
            }
        }

        progress.percentage = Math.floor(
            (progress.completedCourses.length / totalCourses) * 100
        );

        const saved = await progress.save();
        return saved.toObject();
    }

    async countAssignedSeats(companyId: string, courseId: string): Promise<number> {
        // Get all learning paths that contain this course
        const learningPaths = await EmployeeLearningPath.find({
            companyId: new Types.ObjectId(companyId),
            'courses.courseId': new Types.ObjectId(courseId)
        }).select('_id');

        const learningPathIds = learningPaths.map(lp => lp._id);

        // Count unique employees who have been assigned any learning path containing this course
        const uniqueEmployees = await EmployeeLearningPathProgress.distinct('employeeId', {
            companyId: new Types.ObjectId(companyId),
            learningPathId: { $in: learningPathIds }
        });

        return uniqueEmployees.length;
    }

}