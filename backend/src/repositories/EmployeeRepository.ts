import { injectable } from 'inversify';
import { IEmployeeRepository } from '../core/interfaces/repositories/IEmployeeRepository';
import { IEmployee, Employee } from '../models/Employee';
import { Company } from '../models/Company';

@injectable()
export class EmployeeRepository implements IEmployeeRepository {

    async create(data: {
        name: string;
        email: string;
        companyId: string;
        password?: string;
        coursesAssigned?: string[];
        position?: string;
    }): Promise<IEmployee> {
        const employee = await new Employee(data).save();
        await Company.findByIdAndUpdate(data.companyId, {
            $push: { employees: employee._id }
        });
        return employee;
    }

    async findByEmail(email: string): Promise<IEmployee | null> {
        return await Employee.findOne({ email });
    }

    async findAll(): Promise<IEmployee[]> {
        return await Employee.find();
    }

    async findById(employeeId: string): Promise<IEmployee | null> {
        console.log('employeeId from repository ', employeeId);
        return await Employee.findById(employeeId);
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
                { email: { $regex: search, $options: 'i' } },
            ]
        };

        const sort: Record<string, 1 | -1> = {};
        sort[sortField] = sortOrder === 'asc' ? 1 : -1;

        return await Employee.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async getEmployeesByCompany(
        companyId: string,
        skip: number,
        limit: number,
        search: string,
    ): Promise<IEmployee[]> {
        const query: Record<string, unknown> = {
            companyId,
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ]
        };
        return await Employee.find(query)
            .skip(skip)
            .limit(limit);
    }

    async countEmployeesByCompany(companyId: string, search: string): Promise<number> {
        const query: Record<string, unknown> = { companyId };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        return await Employee.countDocuments(query);
    }

    async updateEmployeeById(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(employeeId, data, { new: true });
    }

    async blockEmployee(employeeId: string, status: boolean): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(employeeId, { isBlocked: status }, { new: true });
    }
}
