import { IEmployee } from '../../../../models/Employee';
import { ICompany } from '../../../../models/Company';
export interface IEmployeeCompanyService {
  getMyCompany(employeeId: string): Promise<IEmployee | null>;
  getRequestedCompany(employeeId: string): Promise<IEmployee | null>;
  findCompanyByCode(code: string): Promise<ICompany>;
  sendRequest(employeeId: string, companyId: string): Promise<void>;
  cancelRequest(employeeId: string): Promise<void>;
  leaveCompany(employeeId: string): Promise<void>;
  getInvitation(employeeId: string): Promise<any | null>;
  acceptInvite(employeeId: string): Promise<void>;
  rejectInvite(employeeId: string): Promise<void>;
}
