import { injectable } from 'inversify';
import { IEmployeeRepository } from '../core/interfaces/repositories/IEmployeeRepository';
import { IEmployee, Employee } from '../models/Employee';
import { Course } from '../models/Course';
import { throwError } from '../utils/ResANDError';
import { MESSAGES } from '../utils/ResponseMessages';

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

}
