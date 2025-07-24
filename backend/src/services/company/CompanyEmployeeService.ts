// services/company/CompanyEmployeeService.ts

import { inject, injectable } from "inversify";
import { ICompanyEmployeeService } from "../../core/interfaces/services/company/ICompanyEmployeeService";
import { ICompanyEmployeeRepository } from "../../core/interfaces/repositories/company/ICompanyEmployeeRepository";
import bcrypt from "bcryptjs";
import { throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { generateOtp, sendOtpEmail, } from "../../utils/OtpServices";


@injectable()
export class CompanyEmployeeService implements ICompanyEmployeeService {
    constructor(
        @inject("CompanyEmployeeRepository") private employeeRepo: ICompanyEmployeeRepository
    ) { }

    async addEmployee(data: {
        companyId: string;
        name: string;
        email: string;
        password?: string;
        coursesAssigned?: string[];
        position: string;
    }): Promise<any> {


        console.log("data:", data)
        const existing = await this.employeeRepo.findByEmail(data.email);
        if (existing) {
            throwError("Employee already exists", STATUS_CODES.CONFLICT);
        }

        const tempPassword = "Temp@" + generateOtp();
        console.log(`new employee added email :${data.email} & password :${tempPassword}`)

        const hashedPassword = tempPassword
            ? await bcrypt.hash(tempPassword, 10)
            : undefined;

        const newEmployee = await this.employeeRepo.create({
            ...data,
            password: hashedPassword,
        });
        await sendOtpEmail(data.email, tempPassword);
        return newEmployee;
    }

    async getAllEmployees(companyId: string, page: number, limit: number): Promise<any[]> {
        const skip = (page - 1) * limit;
        return await this.employeeRepo.findByCompanyId(companyId, skip, limit);
    }

    async getEmployeeById(employeeId: string): Promise<any | null> {
        return await this.employeeRepo.findById(employeeId);
    }

    async blockEmployee(id: string, status: boolean): Promise<void> {
        const employee = await this.employeeRepo.findById(id);
        if (!employee) throwError("Employee not found", STATUS_CODES.NOT_FOUND);
        await this.employeeRepo.blockEmployee(id, status);
    }

}
