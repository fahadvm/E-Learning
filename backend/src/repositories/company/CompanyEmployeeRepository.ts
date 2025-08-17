// infrastructure/database/repositories/company/EmployeeRepository.ts

import { ICompanyEmployeeRepository } from '../../core/interfaces/repositories/employee/ICompanyEmployeeRepository';
import  { IEmployee ,Employee} from '../../models/Employee';
import { injectable } from 'inversify';

@injectable()
export class CompanyEmployeeRepository implements ICompanyEmployeeRepository {


    async create(data: {
        name: string;
        email: string;
        companyId: string;
        password?: string;
        coursesAssigned?: string[];
        position?: string
    }): Promise<IEmployee> {
        return Employee.create(data);
    }

    async findByEmail(email: string): Promise<IEmployee | null> {
        return Employee.findOne({ email });

    }

    async findAll(): Promise<IEmployee[]> {
        return Employee.find();

    }

    async findById(employeeId: string): Promise<IEmployee | null> {
        return await Employee.findById(employeeId);
    }


    async blockEmployee(id: string, status: boolean): Promise<void> {
        await Employee.findByIdAndUpdate(id, { blocked: status });
    }

    async findByCompanyId(
        companyId: string,
        skip: number,
        limit: number,
        search: string,
        sortField: string,
        sortOrder: string
    ): Promise<IEmployee[]> {
        const query: any = {
            companyId,
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ],
        };

        const sort: any = {};
        sort[sortField] = sortOrder === 'asc' ? 1 : -1;

        return Employee.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async updateEmployeeById(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(employeeId, data, { new: true });
    }



}