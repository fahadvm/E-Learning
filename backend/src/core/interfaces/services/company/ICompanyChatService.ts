
import { IChat } from "../../../../models/chat";

export interface ICompanyChatService {
    createCompanyGroup(companyId: string, groupName: string): Promise<IChat>;
    addEmployeeToGroup(companyId: string, employeeId: string): Promise<void>;
    removeEmployeeFromGroup(companyId: string, employeeId: string): Promise<void>;
    getCompanyGroup(companyId: string): Promise<IChat | null>;
}
