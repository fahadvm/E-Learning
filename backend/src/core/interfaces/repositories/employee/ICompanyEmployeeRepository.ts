
import { IEmployee } from '../../../../models/Employee';

export interface ICompanyEmployeeRepository {
    create(data: {
        name: string;
        email: string;
        companyId: string;
        password?: string;
        coursesAssigned?: string[];
        position?: string
    }): Promise<IEmployee>;

    findByEmail(email: string): Promise<IEmployee | null>;

    findAll(): Promise<IEmployee[]>;

    findByCompanyId(
        companyId: string,
        skip: number,
        limit: number,
        search: string,
        sortField: string,
        sortOrder: string
    ): Promise<IEmployee[]>;


    findById(employeeId: string): Promise<IEmployee | null>;

    blockEmployee(id: string, status: boolean): Promise<void>;

    updateEmployeeById(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null>;



}