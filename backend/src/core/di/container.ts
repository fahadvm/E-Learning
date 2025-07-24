import { Container } from "inversify";

// Repositories
import { IStudentRepository } from "../interfaces/repositories/student/IStudentRepository";
import { StudentRepository } from "../../repositories/student/StudentAuthRepository";

import { ICompanyRepository } from "../interfaces/repositories/company/ICompanyRepository";
import { CompanyRepository } from "../../repositories/company/CompanyRepository";

import { IAdminRepository } from "../../core/interfaces/repositories/admin/IAdminRepository";
import { AdminRepository } from "../../repositories/admin/AdminRepository";

import { ICompanyEmployeeRepository } from "../interfaces/repositories/company/ICompanyEmployeeRepository";
import { CompanyEmployeeRepository } from "../../repositories/company/CompanyEmployeeRepository";


// Services
import { IStudentAuthService } from "../../core/interfaces/services/student/IStudentAuthService";
import { StudentAuthService } from "../../services/student/StudentAuthService"; 

import { ICompanyAuthService } from "../../core/interfaces/services/company/ICompanyAuthService";
import { CompanyAuthService } from "../../services/company/CompanyAuthService"; 

import { AdminAuthService } from "../../services/admin/AdminAuthService";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuthService";

import { CompanyEmployeeService } from "../../services/company/CompanyEmployeeService";
import { ICompanyEmployeeService } from "../interfaces/services/company/ICompanyEmployeeService";



// Controllers
import { StudentAuthController } from "../../controllers/student/StudentAuthController";
import { IAuthController } from "../../core/interfaces/controllers/user/IAuthController";

import { CompanyAuthController } from "../../controllers/company/CompanyAuthController";
import { ICompanyAuthController } from "../../core/interfaces/controllers/company/ICompanyAuthController";

import { OtpRepository } from "../../repositories/common/OtpRepository";
import { IOtpRepository } from "../interfaces/repositories/common/IOtpRepository";

import { AdminAuthController } from "../../controllers/admin/AdminAuthController";
import { CompanyEmployeeController } from "../../controllers/company/CompanyEmployeeController";




const container = new Container();

// Bindings
container.bind<IStudentRepository>("StudentRepository").to(StudentRepository);
container.bind<IStudentAuthService>("StudentAuthService").to(StudentAuthService);
container.bind<IAuthController>("StudentAuthController").to(StudentAuthController);
container.bind<IOtpRepository>("OtpRepository").to(OtpRepository);

container.bind<ICompanyRepository>("CompanyRepository").to(CompanyRepository);
container.bind<ICompanyAuthService>("CompanyAuthService").to(CompanyAuthService);
container.bind<ICompanyAuthController>("CompanyAuthController").to(CompanyAuthController);

container.bind<ICompanyEmployeeService>("CompanyEmployeeService").to(CompanyEmployeeService);
container.bind<ICompanyEmployeeRepository>("CompanyEmployeeRepository").to(CompanyEmployeeRepository);
container.bind<CompanyEmployeeController>("CompanyEmployeeController").to(CompanyEmployeeController);



    
container.bind<AdminAuthController>("AdminAuthController").to(AdminAuthController);
container.bind<IAdminAuthService>("AdminAuthService").to(AdminAuthService);
container.bind<IAdminRepository>("AdminRepository").to(AdminRepository);





export default container;
