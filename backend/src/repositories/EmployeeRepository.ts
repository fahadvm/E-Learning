import { injectable } from 'inversify';
import { IEmployeeRepository } from '../core/interfaces/repositories/employee/IEmployeeRepository';
import { IEmployee,Employee} from '../models/Employee';

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
        const employee = new Employee(data);
        return await employee.save();
    }

    async findByEmail(email: string): Promise<IEmployee | null> {
        return await Employee.findOne({ email });
    }

    async findAll(): Promise<IEmployee[]> {
        return await Employee.find();
    }

    async findByCompanyId(companyId: string, skip: number, limit: number): Promise<IEmployee[]> {
        return await Employee.find({ companyId })
            .skip(skip)
            .limit(limit);
    }

    async findById(employeeId: string): Promise<IEmployee | null> {
        return await Employee.findById(employeeId);
    }

    async getEmployeesByCompany(companyId: string, page: number, limit: number, search: string): Promise<IEmployee[]> {
        const query: any = { companyId };
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        return await Employee.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
    }

    async countEmployeesByCompany(companyId: string, search: string): Promise<number> {
        const query: any = { companyId };
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        return await Employee.countDocuments(query);
    }

    async blockEmployee(employeeId: string): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(
            employeeId,
            { isBlocked: true },
            { new: true }
        );
    }

    async unblockEmployee(employeeId: string): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(
            employeeId,
            { isBlocked: false },
            { new: true }
        );
    }
}
