import { Container } from 'inversify';
import { TYPES } from './types'; 

// ===== Repositories =====
import { IStudentRepository } from '../interfaces/repositories/student/IStudentRepository';
import { StudentRepository } from '../../repositories/StudentRepository';
import { ICompanyRepository } from '../interfaces/repositories/company/ICompanyRepository';
import { CompanyRepository } from '../../repositories/CompanyRepository';
import { IAdminRepository } from '../interfaces/repositories/admin/IAdminRepository';
import { AdminRepository } from '../../repositories/AdminRepository';
import { ICompanyEmployeeRepository } from '../interfaces/repositories/employee/ICompanyEmployeeRepository';
import { CompanyEmployeeRepository } from '../../repositories/company/CompanyEmployeeRepository';
import { IEmployeeRepository } from '../interfaces/repositories/employee/IEmployeeRepository';
import { EmployeeRepository } from '../../repositories/EmployeeRepository';
import { ITeacherRepository } from '../interfaces/repositories/teacher/ITeacherRepository';
import { TeacherRepository } from '../../repositories/TeacherRepository';
import { IOtpRepository } from '../interfaces/repositories/common/IOtpRepository';
import { OtpRepository } from '../../repositories/common/OtpRepository';
import { ICourseRepository } from '../interfaces/repositories/course/ICourseRepository';
import { CourseRepository } from '../../repositories/CourseRepository';
import { ISubscriptionPlanRepository } from '../interfaces/repositories/ISubscriptionPlanRepository';
import { SubscriptionPlanRepository } from '../../repositories/SubscriptionPlanRepository';

// ===== Services =====
import { IStudentAuthService } from '../interfaces/services/student/IStudentAuthService';
import { StudentAuthService } from '../../services/student/student.auth.service';
import { IStudentProfileService } from '../interfaces/services/student/IStudentProfileService';
import { StudentProfileService } from '../../services/student/student.profile.service';
import { IStudentCourseService } from '../interfaces/services/student/IStudentCourseService';
import { StudentCourseService } from '../../services/student/student.course.service';
import { StudentSubscriptionService } from '../../services/student/student.subscription.service';
import { IStudentSubscriptionService } from '../interfaces/services/student/IStudentSubscriptionService';
import { ICompanyAuthService } from '../interfaces/services/company/ICompanyAuthService';
import { CompanyAuthService } from '../../services/company/company.auth.service';
import { ICompanyProfileService } from '../interfaces/services/company/ICompanyProfileService';
import { CompanyProfileService } from '../../services/company/company.profile.service';
import { ICompanyCourseService } from '../interfaces/services/company/ICompanyCourseService';
import { CompanyCourseService } from '../../services/company/company.course.service';
import { ICompanyEmployeeService } from '../interfaces/services/company/ICompanyEmployeeService';
import { CompanyEmployeeService } from '../../services/company/company.employee.service';
import { ICompanySubscriptionService } from '../interfaces/services/company/ICompanySubscriptionService';
import { CompanySubscriptionService } from '../../services/company/company.subscripton.service';
import { IAdminAuthService } from '../interfaces/services/admin/IAdminAuthService';
import { AdminAuthService } from '../../services/admin/Admin.Auth.Service';
import { IAdminStudentService } from '../interfaces/services/admin/IAdminStudentService';
import { AdminStudentService } from '../../services/admin/Admin.Student.Service';
import { IAdminCourseService } from '../interfaces/services/admin/IAdminCourseService';
import { AdminCourseService } from '../../services/admin/Admin.Course.Service';
import { IAdminTeacherService } from '../interfaces/services/admin/IAdminTeacherService';
import { AdminTeacherService } from '../../services/admin/Admin.Teacher.Service';
import { IAdminCompanyService } from '../interfaces/services/admin/IAdminCompanyService';
import { AdminCompanyService } from '../../services/admin/Admin.Company.Service';
import { IEmployeeAuthService } from '../interfaces/services/employee/IEmployeeAuthService';
import { EmployeeAuthService } from '../../services/employee/employeeAuthservice';
import { ITeacherAuthService } from '../interfaces/services/teacher/ITeacherAuthService';
import { TeacherAuthService } from '../../services/teacher/teacher.auth.service';
import { ITeacherCourseService } from '../interfaces/services/teacher/ITeacherCourseService';
import { TeacherCourseService } from '../../services/teacher/teacher.course.service';
import { ITeacherProfileService } from '../interfaces/services/teacher/ITeacherProfileService';
import { TeacherProfileService } from '../../services/teacher/teacher.profile.service';
import { IAdminSubscriptionPlanService } from '../interfaces/services/admin/IAdminSubscriptionPlanService';
import { AdminSubscriptionPlanService } from '../../services/admin/Admin.Subscription.Service';


// ===== Controllers =====
import { StudentAuthController } from '../../controllers/student/student.auth.controller';
import {StudentProfileController} from '../../controllers/student/student.profile.controller';
import { StudentCourseController } from '../../controllers/student/student.course.controller';
import { StudentSubscriptionController } from '../../controllers/student/student.subscription.controller';
import { CompanyAuthController } from '../../controllers/company/company.auth.controller';
import { CompanyEmployeeController } from '../../controllers/company/company.employee.controller';
import { CompanyCourseController } from '../../controllers/company/company.course.controller';
import { CompanyProfileController } from '../../controllers/company/company.profile.controller';
import { CompanySubscriptionController } from '../../controllers/company/company.subscription.controller';
import { AdminAuthController } from '../../controllers/admin/admin.auth.controller';
import { AdminCourseController } from '../../controllers/admin/admin.course.controller';
import { AdminTeacherController } from '../../controllers/admin/admin.teacher.controller';
import { AdminSubscriptionPlanController } from '../../controllers/admin/admin.subscription.controller';
import { AdminStudentController } from '../../controllers/admin/admin.student.controller';
import { TeacherAuthController } from '../../controllers/teacher/teacher.auth.controller';
import { TeacherCourseController } from '../../controllers/teacher/teacher.course.controller';
import { TeacherProfileController } from '../../controllers/teacher/teacher.profile.controller';
import { EmployeeAuthController } from '../../controllers/employee/employeeAuthController';
import { AdminCompanyController } from '../../controllers/admin/admin.company.controller';




const container = new Container();

// ===== Bind Repositories =====
container.bind<IStudentRepository>(TYPES.StudentRepository).to(StudentRepository);
container.bind<ICompanyRepository>(TYPES.CompanyRepository).to(CompanyRepository);
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<ICompanyEmployeeRepository>(TYPES.CompanyEmployeeRepository).to(CompanyEmployeeRepository);
container.bind<IEmployeeRepository>(TYPES.EmployeeRepository).to(EmployeeRepository);
container.bind<ITeacherRepository>(TYPES.TeacherRepository).to(TeacherRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<ICourseRepository>(TYPES.CourseRepository).to(CourseRepository);
container.bind<ISubscriptionPlanRepository>(TYPES.SubscriptionPlanRepository).to(SubscriptionPlanRepository);

// ===== Bind Services =====
container.bind<IStudentAuthService>(TYPES.StudentAuthService).to(StudentAuthService);
container.bind<IStudentProfileService>(TYPES.StudentProfileService).to(StudentProfileService);
container.bind<IStudentCourseService>(TYPES.StudentCourseService).to(StudentCourseService);
container.bind<IStudentSubscriptionService>(TYPES.StudentSubscriptionService).to(StudentSubscriptionService);

container.bind<ICompanyAuthService>(TYPES.CompanyAuthService).to(CompanyAuthService);
container.bind<ICompanyProfileService>(TYPES.CompanyProfileService).to(CompanyProfileService);
container.bind<ICompanyCourseService>(TYPES.CompanyCourseService).to(CompanyCourseService);
container.bind<ICompanyEmployeeService>(TYPES.CompanyEmployeeService).to(CompanyEmployeeService);
container.bind<ICompanySubscriptionService>(TYPES.CompanySubscriptionService).to(CompanySubscriptionService);

container.bind<IAdminAuthService>(TYPES.AdminAuthService).to(AdminAuthService);
container.bind<IAdminStudentService>(TYPES.AdminStudentService).to(AdminStudentService);
container.bind<IAdminTeacherService>(TYPES.AdminTeacherService).to(AdminTeacherService);
container.bind<IAdminCourseService>(TYPES.AdminCourseService).to(AdminCourseService);
container.bind<IAdminCompanyService>(TYPES.AdminCompanyService).to(AdminCompanyService);
container.bind<IEmployeeAuthService>(TYPES.EmployeeAuthService).to(EmployeeAuthService);
container.bind<ITeacherAuthService>(TYPES.TeacherAuthService).to(TeacherAuthService);
container.bind<ITeacherCourseService>(TYPES.TeacherCourseService).to(TeacherCourseService);
container.bind<ITeacherProfileService>(TYPES.TeacherProfileService).to(TeacherProfileService);
container.bind<IAdminSubscriptionPlanService>(TYPES.AdminSubscriptionPlanService).to(AdminSubscriptionPlanService);

// ===== Bind Controllers =====
container.bind<StudentAuthController>(TYPES.StudentAuthController).to(StudentAuthController);
container.bind<StudentProfileController>(TYPES.StudentProfileController).to(StudentProfileController);
container.bind<StudentCourseController>(TYPES.StudentCourseController).to(StudentCourseController);
container.bind<StudentSubscriptionController>(TYPES.StudentSubscriptionController).to(StudentSubscriptionController);
container.bind<CompanyAuthController>(TYPES.CompanyAuthController).to(CompanyAuthController);
container.bind<CompanyProfileController>(TYPES.CompanyProfileController).to(CompanyProfileController);
container.bind<CompanyEmployeeController>(TYPES.CompanyEmployeeController).to(CompanyEmployeeController);
container.bind<CompanyCourseController>(TYPES.CompanyCourseController).to(CompanyCourseController);
container.bind<CompanySubscriptionController>(TYPES.CompanySubscriptionController).to(CompanySubscriptionController);
container.bind<AdminAuthController>(TYPES.AdminAuthController).to(AdminAuthController);
container.bind<AdminCourseController>(TYPES.AdminCourseController).to(AdminCourseController);
container.bind<AdminTeacherController>(TYPES.AdminTeacherController).to(AdminTeacherController);
container.bind<AdminStudentController>(TYPES.AdminStudentController).to(AdminStudentController);
container.bind<AdminCompanyController>(TYPES.AdminCompanyController).to(AdminCompanyController);
container.bind<AdminSubscriptionPlanController>(TYPES.SubscriptionPlanController).to(AdminSubscriptionPlanController);
container.bind<TeacherAuthController>(TYPES.TeacherAuthController).to(TeacherAuthController);
container.bind<TeacherCourseController>(TYPES.TeacherCourseController).to(TeacherCourseController);
container.bind<TeacherProfileController>(TYPES.TeacherProfileController).to(TeacherProfileController);
container.bind<EmployeeAuthController>(TYPES.EmployeeAuthController).to(EmployeeAuthController);

export default container;
