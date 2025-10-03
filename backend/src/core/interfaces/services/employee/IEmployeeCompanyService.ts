// src/core/interfaces/services/employee/IEmployeeCompanyService.ts
export interface IEmployeeCompanyService {
  getMyCompany(employeeId: string): Promise<any>;
  getRequestedCompany(employeeId: string): Promise<any>;
  findCompanyByCode(code: string): Promise<any>;
  sendRequest(employeeId: string, companyId: string): Promise<void>;
  cancelRequest(employeeId: string): Promise<void>;
  leaveCompany(employeeId: string): Promise<void>;
}
