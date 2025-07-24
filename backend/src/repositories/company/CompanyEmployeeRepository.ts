// infrastructure/database/repositories/company/EmployeeRepository.ts

import { ICompanyEmployeeRepository } from "../../core/interfaces/repositories/company/ICompanyEmployeeRepository";
import Employee, { IEmployee } from "../../models/Employee";
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";

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

    async findByCompanyId(companyId: string, skip: number, limit: number): Promise<IEmployee[]> {
        return Employee.find({ companyId })
            .skip(skip)
            .limit(limit);
    }
}