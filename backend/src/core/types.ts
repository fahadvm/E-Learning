import { CompanyAuthController } from "../controllers/company/CompanyAuthController";
// import { CompanyRepository } from "../repositories/company/companyRepository";
import { CompanyAuthService } from "../services/company/CompanyAuthService";

export const TYPES = {


  StudentAuthController: Symbol.for('StudentAuthController'),
  CompanyAuthController: Symbol.for('CompanyAuthController'),
  CompanyEmployeeController: Symbol.for("CompanyEmployeeController"),


  StudentAuthService: Symbol.for('StudentAuthService'),
  CompanyAuthService: Symbol.for('CompanyAuthService'),
  CompanyEmployeeService: Symbol.for('CompanyEmployeeService'),



  StudentAuthRepository: Symbol.for('StudentAuthRepository'),
  CompanyRepository: Symbol.for('CompanyRepository'),
  CompanyEmployeeRepository: Symbol.for('CompanyEmployeeRepository'),





};