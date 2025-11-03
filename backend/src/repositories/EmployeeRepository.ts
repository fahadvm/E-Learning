import { injectable } from 'inversify';
import { IEmployeeRepository } from '../core/interfaces/repositories/IEmployeeRepository';
import { IEmployee, Employee, ICourseProgress } from '../models/Employee';
import { Course } from '../models/Course';
import { throwError } from '../utils/ResANDError';
import { MESSAGES } from '../utils/ResponseMessages';
import { Types } from 'mongoose';
import { STATUS_CODES } from '../utils/HttpStatuscodes';
import { EmployeeLearningRecord, IEmployeeLearningRecord } from '../models/EmployeeLearningRecord';

@injectable()
export class EmployeeRepository implements IEmployeeRepository {
    async create(employee: Partial<IEmployee>): Promise<IEmployee> {
        return await Employee.create(employee);
    }

    async findByEmail(email: string): Promise<IEmployee | null> {
        return await Employee.findOne({ email }).lean().exec();
    }

    async updateByEmail(email: string, updateData: Partial<IEmployee>): Promise<IEmployee | null> {
        return await Employee.findOneAndUpdate({ email }, { $set: updateData }, { new: true })
            .lean()
            .exec();
    }

    async findAll(): Promise<IEmployee[]> {
        return await Employee.find().lean().exec();
    }

    async findById(employeeId: string): Promise<IEmployee | null> {
        return await Employee.findById(employeeId).lean().exec();
    }

    async getAssignedCourses(employeeId: string): Promise<IEmployee | null> {
        const employee = await Employee.findById(employeeId)
            .populate("coursesAssigned")
            .lean();
        return employee;
    }


    async findByCompanyId(
        companyId: string,
        skip: number,
        limit: number,
        search: string,
        sortField: string = 'createdAt',
        sortOrder: 'asc' | 'desc' = 'desc'
    ): Promise<IEmployee[]> {
        const query: Record<string, unknown> = {
            companyId,
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        };

        const sort: Record<string, 1 | -1> = {};
        sort[sortField] = sortOrder === 'asc' ? 1 : -1;

        return await Employee.find(query).sort(sort).skip(skip).limit(limit).lean().exec();
    }

    async getEmployeesByCompany(
        companyId: string,
        skip: number,
        limit: number,
        search: string
    ): Promise<IEmployee[]> {
        const query: Record<string, unknown> = {
            companyId,
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        };

        return await Employee.find(query).skip(skip).limit(limit).lean().exec();
    }

    async countEmployeesByCompany(companyId: string, search: string): Promise<number> {
        const query: Record<string, unknown> = { companyId };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        return await Employee.countDocuments(query);
    }

    async updateById(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(employeeId, data, { new: true }).lean().exec();
    }

    async updateCancelRequestById(employeeId: string): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(employeeId, {
            status: 'notRequest',
            $unset: { requestedCompanyId: '' },
        });
    }
    // async updateRemoveCompanyById(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
    //     return await Employee.updateById(employeeId, {
    //         status: "notRequest",
    //         $unset: { requestedCompanyId: "" },
    //     });
    // }

    async blockEmployee(employeeId: string, status: boolean): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(employeeId, { isBlocked: status }, { new: true })
            .lean()
            .exec();
    }

    async findByGoogleId(googleId: string): Promise<IEmployee | null> {
        return await Employee.findOne({ googleId }).lean().exec();
    }

    async findCompanyByEmployeeId(employeeId: string): Promise<IEmployee | null> {
        return await Employee.findById(employeeId).populate('companyId').lean().exec();
    }

    async findRequestedCompanyByEmployeeId(employeeId: string): Promise<IEmployee | null> {
        return await Employee.findById(employeeId).populate('requestedCompanyId').lean().exec();
    }

    async findRequestedEmployees(companyId: string): Promise<IEmployee[]> {
        return await Employee.find({

            requestedCompanyId: companyId,
            status: 'pending',
        });
    }

    async findEmployeeAndApprove(companyId: string, employeeId: string): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(employeeId, {
            status: 'approved',
            companyId,
            $unset: { requestedCompanyId: '' },
        });
    }

    async findEmployeeAndReject(employeeId: string): Promise<IEmployee | null> {

        return await Employee.findByIdAndUpdate(employeeId, {
            status: 'notRequested',
            $unset: { requestedCompanyId: '' },
        });
    }

    async assignCourseToEmployee(courseId: string, employeeId: string): Promise<void> {
        const employee = await Employee.findById(employeeId);
        if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND);

        const courseExists = await Course.exists({ _id: courseId });
        if (!courseExists) throwError(MESSAGES.COURSE_NOT_FOUND);

        const alreadyAssigned = employee.coursesAssigned?.some(
            (id) => id.toString() === courseId.toString()
        );
        if (alreadyAssigned) return;

        await Employee.updateOne(
            { _id: employeeId },
            { $push: { coursesAssigned: courseId } }
        );
    }


    async updateEmployeeProgress(employeeId: string, courseId: string, lessonId: string): Promise<ICourseProgress> {
        if (!Types.ObjectId.isValid(employeeId) || !Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(lessonId)) throw new Error('Invalid ID');

        const student = await Employee.findById(employeeId);
        if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        const course = await Course.findById(courseId);
        if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        let progress = student.coursesProgress.find(p => p.courseId.toString() === courseId);
        if (!progress) {
            progress = { courseId: new Types.ObjectId(courseId), completedLessons: [], completedModules: [], percentage: 0, lastVisitedLesson: undefined, lastVisitedTime: new Date(), notes: '' };
            student.coursesProgress.push(progress);
        }

        if (!progress.completedLessons.includes(lessonId)) progress.completedLessons.push(lessonId);
        progress.lastVisitedLesson = lessonId;
        progress.lastVisitedTime = new Date();

        const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
        const completedLessons = progress.completedLessons.length;
        progress.percentage = Math.min((completedLessons / totalLessons) * 100, 100);

        const completedModuleIds: string[] = [];
        for (const module of course.modules) {
            const moduleLessons = module.lessons.map(l => l._id!.toString());
            if (moduleLessons.every(id => progress!.completedLessons.includes(id))) {
                const moduleId = module._id!.toString();
                if (!progress.completedModules.includes(moduleId)) completedModuleIds.push(moduleId);
            }
        }
        progress.completedModules = completedModuleIds;
        await student.save({ validateBeforeSave: true });
        return progress;
    }

    async getOrCreateCourseProgress(employeeId: string, courseId: string): Promise<ICourseProgress> {
        const student = await Employee.findById(employeeId);
        if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        let progress = student.coursesProgress.find(p => p.courseId.toString() === courseId);
        if (!progress) {
            progress = { courseId: new Types.ObjectId(courseId), completedLessons: [], completedModules: [], percentage: 0, lastVisitedLesson: undefined, lastVisitedTime: new Date(), notes: '' };
            student.coursesProgress.push(progress);
            await student.save();
        }
        return progress;
    }

    async saveNotes(employeeId: string, courseId: string, notes: string): Promise<ICourseProgress> {
        const employee = await Employee.findById(employeeId);
        if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        let courseProgress = employee.coursesProgress.find(p => p.courseId.toString() === courseId);
        if (!courseProgress) {
            courseProgress = { courseId: new Types.ObjectId(courseId), completedLessons: [], completedModules: [], percentage: 0, lastVisitedLesson: undefined, notes: notes };
            employee.coursesProgress.push(courseProgress);
        } else {
            courseProgress.notes = notes;
        }
        await employee.save();
        return courseProgress;
    }

    async updateLearningTime(employeeId: string, courseId: string, date: Date, roundedHours: number): Promise<IEmployeeLearningRecord> {

        let record = await EmployeeLearningRecord.findOneAndUpdate(
            {
                employeeId,
                date,
                "courses.courseId": new Types.ObjectId(courseId)
            },
            {
                $inc: {
                    "courses.$.minutes": roundedHours,
                    totalMinutes: roundedHours
                }
            },
            { new: true }
        );

        if (!record) {
            record = await EmployeeLearningRecord.findOneAndUpdate(
                { employeeId, date },
                {
                    $inc: { totalMinutes: roundedHours },
                    $setOnInsert: { employeeId, date },
                    $push: { courses: { courseId: new Types.ObjectId(courseId), minutes: roundedHours } },
                },
                { new: true, upsert: true }
            )
        }
        if (!record) throwError(MESSAGES.RECORD_CREATION_FAILED);
        return record;
    }

    async getLearningRecords(employeeId: string): Promise<IEmployeeLearningRecord[]> {
        return EmployeeLearningRecord.find({ employeeId })
            .populate("courses.courseId", "title duration")
            .sort({ updatedAt: -1 })
            .lean();
    }

    async getProgress(employeeId: string): Promise<ICourseProgress[] | null> {
        const employee = await Employee.findById(employeeId)
            .populate("coursesProgress.courseId", "title duration")
            .lean();

        if (!employee) return null;
        return employee.coursesProgress || [];
    }
}


