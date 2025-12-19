import { injectable } from 'inversify';
import { IEmployeeRepository } from '../core/interfaces/repositories/IEmployeeRepository';
import { IEmployee, Employee, ICourseProgress } from '../models/Employee';
import { Course } from '../models/Course';
import { throwError } from '../utils/ResANDError';
import { MESSAGES } from '../utils/ResponseMessages';
import mongoose, { Types } from 'mongoose';
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
        return await Employee.findById(employeeId).populate('companyId', 'name').lean().exec();
    }

    async getAssignedCourses(employeeId: string): Promise<IEmployee | null> {
        const employee = await Employee.findById(employeeId)
            .populate("coursesAssigned")
            .lean();
        return employee;
    }

    async getTotalMinutes(employeeId: string, companyId: string) {
        const result = await EmployeeLearningRecord.aggregate([
            { $match: { employeeId: new mongoose.Types.ObjectId(employeeId), companyId: new mongoose.Types.ObjectId(companyId) } },
            { $group: { _id: null, total: { $sum: "$totalMinutes" } } }
        ]);

        return result.length > 0 ? result[0].total : 0;
    }



    async findByCompanyId(
        companyId: string,
        skip: number,
        limit: number,
        search: string,
        sortField: string = 'createdAt',
        sortOrder: 'asc' | 'desc' = 'desc',
        department?: string,
        position?: string
    ): Promise<IEmployee[]> {
        const query: Record<string, unknown> = {
            companyId,
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        };

        if (department) {
            query.department = department;
        }
        if (position) {
            query.position = position;
        }

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

    async countEmployeesByCompany(companyId: string, search: string, department?: string, position?: string): Promise<number> {
        const query: Record<string, unknown> = { companyId };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (department) {
            query.department = department;
        }
        if (position) {
            query.position = position;
        }
        return await Employee.countDocuments(query);
    }

    async updateById(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
        console.log("update data from service ", data)

        return await Employee.findByIdAndUpdate(employeeId, data, { new: true }).lean().exec();
    }

    async updateCancelRequestById(employeeId: string): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(employeeId, {
            status: 'none',
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
        const employee = await Employee.findById(employeeId)
            .populate("companyId")
            .populate("requestedCompanyId")
            .exec()

        return employee

    }

    async findRequestedCompanyByEmployeeId(employeeId: string): Promise<IEmployee | null> {
        return await Employee.findById(employeeId).populate('requestedCompanyId').lean().exec();
    }

    async findRequestedEmployees(companyId: string): Promise<IEmployee[]> {
        return await Employee.find({

            requestedCompanyId: companyId,
            status: 'requested',
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
            status: 'none',
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

    async updateLoginStreak(employeeId: string): Promise<any> {
        const employee = await Employee.findById(employeeId);
        if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND);

        const today = new Date();
        const lastLogin = employee.lastLoginDate ? new Date(employee.lastLoginDate) : null;

        const normalizeDate = (date: Date) =>
            new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (!lastLogin) {
            employee.streakCount = 1;
        } else {
            const todayStart = normalizeDate(today);
            const lastLoginStart = normalizeDate(lastLogin);

            const diffDays = Math.floor(
                (todayStart.getTime() - lastLoginStart.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (diffDays === 1) {
                employee.streakCount += 1;
            } else if (diffDays > 1) {
                employee.streakCount = 1;
            }
        }

        employee.lastLoginDate = today;

        if (employee.streakCount > employee.longestStreak) {
            employee.longestStreak = employee.streakCount;
        }

        await employee.save();

        return {
            streakCount: employee.streakCount,
            longestStreak: employee.longestStreak,
        };
    }

    async searchByEmailOrName(query: string): Promise<IEmployee[]> {
        return await Employee.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).lean().exec();
    }
    async findInactiveEmployees(days: number): Promise<IEmployee[]> {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - days);

        return await Employee.find({
            companyId: { $ne: null },
            $or: [
                { lastLoginDate: { $lt: thresholdDate } },
                { lastLoginDate: { $exists: false }, createdAt: { $lt: thresholdDate } }
            ]
        }).lean().exec();
    }

    async findAllPaginated(skip: number, limit: number, search: string, status?: string): Promise<IEmployee[]> {
        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (status === 'blocked') {
            query.isBlocked = true;
        } else if (status === 'active') {
            query.isBlocked = false;
        }

        return await Employee.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).populate('companyId', 'name').lean().exec();
    }

    async countAll(search: string, status?: string): Promise<number> {
        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (status === 'blocked') {
            query.isBlocked = true;
        } else if (status === 'active') {
            query.isBlocked = false;
        }

        return await Employee.countDocuments(query);
    }
}

