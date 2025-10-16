import { Container } from 'inversify';
import { TYPES } from './types'; 

// ===== Repositories =====
import { IStudentRepository } from '../interfaces/repositories/IStudentRepository';
import { StudentRepository } from '../../repositories/StudentRepository';
import { ICompanyRepository } from '../interfaces/repositories/ICompanyRepository';
import { CompanyRepository } from '../../repositories/CompanyRepository';
import { IAdminRepository } from '../interfaces/repositories/IAdminRepository';
import { AdminRepository } from '../../repositories/AdminRepository';
import { IEmployeeRepository } from '../interfaces/repositories/IEmployeeRepository';
import { EmployeeRepository } from '../../repositories/EmployeeRepository';
import { ITeacherRepository } from '../interfaces/repositories/ITeacherRepository';
import { TeacherRepository } from '../../repositories/TeacherRepository';
import { IOtpRepository } from '../interfaces/repositories/admin/IOtpRepository';
import { OtpRepository } from '../../repositories/OtpRepository';
import { ICourseRepository } from '../interfaces/repositories/ICourseRepository';
import { CourseRepository } from '../../repositories/CourseRepository';
import { ISubscriptionPlanRepository } from '../interfaces/repositories/ISubscriptionPlanRepository';
import { SubscriptionPlanRepository } from '../../repositories/SubscriptionPlanRepository';
import { IWishlistRepository } from '../interfaces/repositories/IWishlistRepository';
import { WishlistRepository } from '../../repositories/WishlistRepository';
import { ICartRepository } from '../interfaces/repositories/ICartRepository';
import { CartRepository } from '../../repositories/CartRepository';
import { IOrderRepository } from '../interfaces/repositories/IOrderRepository';
import { OrderRepository } from '../../repositories/OrderRepository';
import { ICompanyOrderRepository } from '../interfaces/repositories/ICompanyOrderRepository';
import { CompanyOrderRepository } from '../../repositories/CompanyOrderRepository';
import { ITeacherAvailabilityRepository } from '../interfaces/repositories/ITeacherAvailabilityRepository';
import { TeacherAvailabilityRepository } from '../../repositories/TeacherAvailibilityRepository';
import { IStudentBookingRepository } from '../interfaces/repositories/IStudentBookingRepository';
import { StudentBookingRepository } from '../../repositories/StudentBookingRepository';

// ===== Services =====
import { IStudentAuthService } from '../interfaces/services/student/IStudentAuthService';
import { StudentAuthService } from '../../services/student/student.auth.service';
import { IStudentProfileService } from '../interfaces/services/student/IStudentProfileService';
import { StudentProfileService } from '../../services/student/student.profile.service';
import { IStudentCourseService } from '../interfaces/services/student/IStudentCourseService';
import { StudentCourseService } from '../../services/student/student.course.service';
import { StudentSubscriptionService } from '../../services/student/student.subscription.service';
import { IStudentSubscriptionService } from '../interfaces/services/student/IStudentSubscriptionService';
import { StudentWishlistService } from '../../services/student/student.wishlist.service';
import { IStudentWishlistService } from '../interfaces/services/student/IStudentWishlistService';
import { IStudentCartService } from '../interfaces/services/student/IStudentCartService';
import { StudentCartService } from '../../services/student/student.cart.service';
import { IStudentPurchaseService } from '../interfaces/services/student/IStudentPurchaseService';
import { StudentPurchaseService } from '../../services/student/student.purchase.service';
import { IStudentBookingService } from '../interfaces/services/student/IStudentBookingService';
import { StudentBookingService } from '../../services/student/student.booking.service';

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
import { CompanyWishlistService } from '../../services/company/company.wishlist.service';
import { ICompanyWishlistService } from '../interfaces/services/company/ICompanyWishlistService';
import { ICompanyCartService } from '../interfaces/services/company/ICompanyCartService';
import { CompanyCartService } from '../../services/company/company.cart.service';
import { ICompanyPurchaseService } from '../interfaces/services/company/ICompanyPurchaseService';
import { CompanyPurchaseService } from '../../services/company/company.purchase.service';

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
import { IAdminSubscriptionPlanService } from '../interfaces/services/admin/IAdminSubscriptionPlanService';
import { AdminSubscriptionPlanService } from '../../services/admin/Admin.Subscription.Service';
import { IAdminOrderService } from '../interfaces/services/admin/IAdminOrderService';
import { AdminOrderService } from '../../services/admin/Admin.order.Service';

import { ITeacherAuthService } from '../interfaces/services/teacher/ITeacherAuthService';
import { TeacherAuthService } from '../../services/teacher/teacher.auth.service';
import { ITeacherCourseService } from '../interfaces/services/teacher/ITeacherCourseService';
import { TeacherCourseService } from '../../services/teacher/teacher.course.service';
import { ITeacherProfileService } from '../interfaces/services/teacher/ITeacherProfileService';
import { TeacherProfileService } from '../../services/teacher/teacher.profile.service';
import { ITeacherAvailabilityService } from '../interfaces/services/teacher/ITeacherAvailability';
import { TeacherAvailabilityService } from '../../services/teacher/teacher.availability.service';

import { IEmployeeProfileService } from '../interfaces/services/employee/IEmployeeProfileService';
import { EmployeeAuthService } from '../../services/employee/employee.auth.service';
import { IEmployeeAuthService } from '../interfaces/services/employee/IEmployeeAuthService';
import { EmployeeProfileService } from '../../services/employee/employee.profile.service';
import { IEmployeeCompanyService } from '../interfaces/services/employee/IEmployeeCompanyService';
import { EmployeeCompanyService } from '../../services/employee/employee.company.service';
import { IEmployeeCourseService } from '../interfaces/services/employee/IEmployeeCourseService';
import { EmployeeCourseService } from '../../services/employee/employee.course.service';

// ===== Controllers =====
import { StudentAuthController } from '../../controllers/student/student.auth.controller';
import {StudentProfileController} from '../../controllers/student/student.profile.controller';
import { StudentCourseController } from '../../controllers/student/student.course.controller';
import { StudentSubscriptionController } from '../../controllers/student/student.subscription.controller';
import { StudentWishlistController } from '../../controllers/student/student.wishlist.controller';
import { StudentCartController } from '../../controllers/student/student.cart.controller';
import { StudentPurchaseController } from '../../controllers/student/student.purchase.controller';
import { StudentBookingController } from '../../controllers/student/student.booking.controller';

import { CompanyAuthController } from '../../controllers/company/company.auth.controller';
import { CompanyEmployeeController } from '../../controllers/company/company.employee.controller';
import { CompanyCourseController } from '../../controllers/company/company.course.controller';
import { CompanyProfileController } from '../../controllers/company/company.profile.controller';
import { CompanySubscriptionController } from '../../controllers/company/company.subscription.controller';
import { CompanyWishlistController } from '../../controllers/company/company.wishlist.controller';
import { CompanyCartController } from '../../controllers/company/company.cart.controller';
import { CompanyPurchaseController} from '../../controllers/company/company.purchase.controller';


import { AdminAuthController } from '../../controllers/admin/admin.auth.controller';
import { AdminCourseController } from '../../controllers/admin/admin.course.controller';
import { AdminTeacherController } from '../../controllers/admin/admin.teacher.controller';
import { AdminSubscriptionPlanController } from '../../controllers/admin/admin.subscription.controller';
import { AdminStudentController } from '../../controllers/admin/admin.student.controller';
import { AdminOrderController } from '../../controllers/admin/admin.order.controller';
import { TeacherAuthController } from '../../controllers/teacher/teacher.auth.controller';
import { TeacherCourseController } from '../../controllers/teacher/teacher.course.controller';
import { TeacherProfileController } from '../../controllers/teacher/teacher.profile.controller';
import { TeacherAvailabilityController } from '../../controllers/teacher/teacher.availability.controller';
import { AdminCompanyController } from '../../controllers/admin/admin.company.controller';
import { EmployeeProfileController } from '../../controllers/employee/employee.profile.controller';
import { EmployeeAuthController } from '../../controllers/employee/employee.auth.controller';
import { EmployeeCompanyController } from '../../controllers/employee/employee.company.controller';
import { EmployeeCourseController } from '../../controllers/employee/employee.course.controller';
import { IStudentTeacherService } from '../interfaces/services/student/IStudentTeacherService';
import { StudentTeacherService } from '../../services/student/student.teacher.service';
import { StudentTeacherController } from '../../controllers/student/student.teacher.controller';
import { TeacherCallRequestController } from '../../controllers/teacher/teacher.call.request.controller';
import { ITeacherCallRequestService } from '../interfaces/services/teacher/ITeacherCallRequestService';
import { TeacherCallRequestService } from '../../services/teacher/teacher.call.request.service';
import { IChatRepository } from '../interfaces/repositories/IChatRepository';
import { ChatRepository } from '../../repositories/ChatRepository';
import { IChatService } from '../interfaces/services/student/IStudentChatService';
import { ChatService } from '../../services/student/student.chat.service';
import { ChatController } from '../../controllers/student/student.chat.controller';
import { IStudentNotificationController } from '../interfaces/controllers/student/IStudentNotificationController';
import { IStudentNotificationRepository } from '../interfaces/repositories/IStudentNotification';
import { IStudentNotificationService } from '../interfaces/services/student/IStudentNotificationService';
import { StudentNotificationController } from '../../controllers/student/student.notification.controller';
import { StudentNotificationRepository } from '../../repositories/StudentNotificationRepository';
import { StudentNotificationService } from '../../services/student/student.notification.service';
import { SharedController } from '../../controllers/shared/shared.controller';
import { INotificationRepository } from '../interfaces/repositories/INotificationRepository';
import { NotificationRepository } from '../../repositories/NotificationRepository';
import { NotificationController } from '../../controllers/shared/notification.controller';
import { INotificationService } from '../interfaces/services/shared/INotificationService';
import { NotificationService } from '../../services/shared/notification.service';
import { TeacherChatController } from '../../controllers/teacher/teacher.chat.controller';
import { TeacherChatService } from '../../services/teacher/teacher.chat.service';
import { ITeacherChatService } from '../interfaces/services/teacher/ITeacherChatService';
import { ICourseResourceRepository } from '../interfaces/repositories/ICourseResourceRepository';
import { CourseResourceRepository } from '../../repositories/CourseResourceRepository';
import { IStudentCommentService } from '../interfaces/services/student/IStudentCommentService';
import { StudentCommentService } from '../../services/student/student.comment.service';
import { ICommentRepository } from '../interfaces/repositories/ICommentRepository';
import { CommentRepository } from '../../repositories/CommentRepository';
import { StudentCommentController } from '../../controllers/student/student.comment.controller';












const container = new Container();

// ===== Bind Repositories =====
container.bind<IStudentRepository>(TYPES.StudentRepository).to(StudentRepository);
container.bind<ICompanyRepository>(TYPES.CompanyRepository).to(CompanyRepository);
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<IEmployeeRepository>(TYPES.EmployeeRepository).to(EmployeeRepository);
container.bind<ITeacherRepository>(TYPES.TeacherRepository).to(TeacherRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<ICourseRepository>(TYPES.CourseRepository).to(CourseRepository);
container.bind<ISubscriptionPlanRepository>(TYPES.SubscriptionPlanRepository).to(SubscriptionPlanRepository);
container.bind<IWishlistRepository>(TYPES.WishlistRepository).to(WishlistRepository);
container.bind<ICartRepository>(TYPES.CartRepository).to(CartRepository);
container.bind<IOrderRepository>(TYPES.OrderRepository).to(OrderRepository);
container.bind<ICompanyOrderRepository>(TYPES.CompanyOrderRepository).to(CompanyOrderRepository);
container.bind<ITeacherAvailabilityRepository>(TYPES.TeacherAvailabilityRepository).to(TeacherAvailabilityRepository);
container.bind<IStudentBookingRepository>(TYPES.StudentBookingRepository).to(StudentBookingRepository);
container.bind<ICourseResourceRepository>(TYPES.CourseResourceRepository).to(CourseResourceRepository);


container.bind<IChatRepository>(TYPES.ChatRepository).to(ChatRepository);
container.bind<IChatService>(TYPES.ChatService).to(ChatService);
container.bind<ChatController>(TYPES.ChatController).to(ChatController);
container.bind<TeacherChatController>(TYPES.TeacherChatController).to(TeacherChatController);
container.bind<ITeacherChatService>(TYPES.TeacherChatService).to(TeacherChatService);
container.bind<IStudentCommentService>(TYPES.StudentCommentService).to(StudentCommentService);
container.bind<ICommentRepository>(TYPES.CommentRepository).to(CommentRepository);
container.bind<StudentCommentController>(TYPES.StudentCommentController).to(StudentCommentController);




// ===== Bind Services =====
container.bind<IStudentAuthService>(TYPES.StudentAuthService).to(StudentAuthService);
container.bind<IStudentProfileService>(TYPES.StudentProfileService).to(StudentProfileService);
container.bind<IStudentCourseService>(TYPES.StudentCourseService).to(StudentCourseService);
container.bind<IStudentSubscriptionService>(TYPES.StudentSubscriptionService).to(StudentSubscriptionService);
container.bind<IStudentWishlistService>(TYPES.StudentWishlistService).to(StudentWishlistService);
container.bind<IStudentCartService>(TYPES.StudentCartService).to(StudentCartService);
container.bind<IStudentPurchaseService>(TYPES.StudentPurchaseService).to(StudentPurchaseService);
container.bind<IStudentBookingService>(TYPES.StudentBookingService).to(StudentBookingService);
container.bind<IStudentTeacherService>(TYPES.StudentTeacherService).to(StudentTeacherService);

container.bind<ICompanyAuthService>(TYPES.CompanyAuthService).to(CompanyAuthService);
container.bind<ICompanyProfileService>(TYPES.CompanyProfileService).to(CompanyProfileService);
container.bind<ICompanyCourseService>(TYPES.CompanyCourseService).to(CompanyCourseService);
container.bind<ICompanyEmployeeService>(TYPES.CompanyEmployeeService).to(CompanyEmployeeService);
container.bind<ICompanySubscriptionService>(TYPES.CompanySubscriptionService).to(CompanySubscriptionService);
container.bind<ICompanyWishlistService>(TYPES.CompanyWishlistService).to(CompanyWishlistService);
container.bind<ICompanyCartService>(TYPES.CompanyCartService).to(CompanyCartService);
container.bind<ICompanyPurchaseService>(TYPES.CompanyPurchaseService).to(CompanyPurchaseService);

container.bind<IAdminAuthService>(TYPES.AdminAuthService).to(AdminAuthService);
container.bind<IAdminStudentService>(TYPES.AdminStudentService).to(AdminStudentService);
container.bind<IAdminTeacherService>(TYPES.AdminTeacherService).to(AdminTeacherService);
container.bind<IAdminCourseService>(TYPES.AdminCourseService).to(AdminCourseService);
container.bind<IAdminCompanyService>(TYPES.AdminCompanyService).to(AdminCompanyService);
container.bind<IAdminSubscriptionPlanService>(TYPES.AdminSubscriptionPlanService).to(AdminSubscriptionPlanService);
container.bind<IAdminOrderService>(TYPES.AdminOrderService).to(AdminOrderService);

container.bind<ITeacherAuthService>(TYPES.TeacherAuthService).to(TeacherAuthService);
container.bind<ITeacherCourseService>(TYPES.TeacherCourseService).to(TeacherCourseService);
container.bind<ITeacherProfileService>(TYPES.TeacherProfileService).to(TeacherProfileService);
container.bind<ITeacherAvailabilityService>(TYPES.TeacherAvailabilityService).to(TeacherAvailabilityService);
container.bind<ITeacherCallRequestService>(TYPES.TeacherCallRequestService).to(TeacherCallRequestService);

container.bind<IEmployeeAuthService>(TYPES.EmployeeAuthService).to(EmployeeAuthService);
container.bind<IEmployeeProfileService>(TYPES.EmployeeProfileService).to(EmployeeProfileService);
container.bind<IEmployeeCompanyService>(TYPES.EmployeeCompanyService).to(EmployeeCompanyService);
container.bind<IEmployeeCourseService>(TYPES.EmployeeCourseService).to(EmployeeCourseService);



// ===== Bind Controllers =====
container.bind<StudentAuthController>(TYPES.StudentAuthController).to(StudentAuthController);
container.bind<StudentProfileController>(TYPES.StudentProfileController).to(StudentProfileController);
container.bind<StudentCourseController>(TYPES.StudentCourseController).to(StudentCourseController);
container.bind<StudentSubscriptionController>(TYPES.StudentSubscriptionController).to(StudentSubscriptionController);
container.bind<StudentWishlistController>(TYPES.StudentWishlistController).to(StudentWishlistController);
container.bind<StudentCartController>(TYPES.StudentCartController).to(StudentCartController);
container.bind<StudentPurchaseController>(TYPES.StudentPurchaseController).to(StudentPurchaseController);
container.bind<StudentBookingController>(TYPES.StudentBookingController).to(StudentBookingController);
container.bind<StudentTeacherController>(TYPES.StudentTeacherController).to(StudentTeacherController);

container.bind<CompanyAuthController>(TYPES.CompanyAuthController).to(CompanyAuthController);
container.bind<CompanyProfileController>(TYPES.CompanyProfileController).to(CompanyProfileController);
container.bind<CompanyEmployeeController>(TYPES.CompanyEmployeeController).to(CompanyEmployeeController);
container.bind<CompanyCourseController>(TYPES.CompanyCourseController).to(CompanyCourseController);
container.bind<CompanySubscriptionController>(TYPES.CompanySubscriptionController).to(CompanySubscriptionController);
container.bind<CompanyWishlistController>(TYPES.CompanyWishlistController).to(CompanyWishlistController);
container.bind<CompanyCartController>(TYPES.CompanyCartController).to(CompanyCartController);
container.bind<CompanyPurchaseController>(TYPES.CompanyPurchaseController).to(CompanyPurchaseController);

container.bind<AdminAuthController>(TYPES.AdminAuthController).to(AdminAuthController);
container.bind<AdminCourseController>(TYPES.AdminCourseController).to(AdminCourseController);
container.bind<AdminTeacherController>(TYPES.AdminTeacherController).to(AdminTeacherController);
container.bind<AdminStudentController>(TYPES.AdminStudentController).to(AdminStudentController);
container.bind<AdminCompanyController>(TYPES.AdminCompanyController).to(AdminCompanyController);
container.bind<AdminSubscriptionPlanController>(TYPES.AdminSubscriptionPlanController).to(AdminSubscriptionPlanController);
container.bind<AdminOrderController>(TYPES.AdminOrderController).to(AdminOrderController);


container.bind<TeacherAuthController>(TYPES.TeacherAuthController).to(TeacherAuthController);
container.bind<TeacherCourseController>(TYPES.TeacherCourseController).to(TeacherCourseController);
container.bind<TeacherProfileController>(TYPES.TeacherProfileController).to(TeacherProfileController);
container.bind<TeacherAvailabilityController>(TYPES.TeacherAvailabilityController).to(TeacherAvailabilityController);
container.bind<TeacherCallRequestController>(TYPES.TeacherCallRequestController).to(TeacherCallRequestController);

container.bind<EmployeeProfileController>(TYPES.EmployeeProfileController).to(EmployeeProfileController);
container.bind<EmployeeAuthController>(TYPES.EmployeeAuthController).to(EmployeeAuthController);
container.bind<EmployeeCompanyController>(TYPES.EmployeeCompanyController).to(EmployeeCompanyController);
container.bind<EmployeeCourseController>(TYPES.EmployeeCourseController).to(EmployeeCourseController);


container.bind<IStudentNotificationRepository>(TYPES.StudentNotificationRepository).to(StudentNotificationRepository);
container.bind<IStudentNotificationService>(TYPES.StudentNotificationService).to(StudentNotificationService);
container.bind<StudentNotificationController>(TYPES.StudentNotificationController).to(StudentNotificationController);


container.bind<SharedController>(TYPES.SharedController).to(SharedController);



container.bind<INotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);
container.bind<NotificationController>(TYPES.NotificationController).to(NotificationController);
container.bind<INotificationService>(TYPES.NotificationService).to(NotificationService);




export default container;
