import { Router } from 'express';

// Admin Route Modules
import authRoutes from './adminRoute/admin.auth.route';
import courseRoutes from './adminRoute/admin.course.route';
import studentRoutes from './adminRoute/admin.student.route';
import teacherRoutes from './adminRoute/admin.teacher.route';
import companyRoutes from './adminRoute/admin.company.route';
import subscriptionRoutes from './adminRoute/admin.subscription.route';
import orderRoutes from './adminRoute/admin.order.route';
import profileRoutes from './adminRoute/admin.profile.route';
// import employeeRoutes from './adminRoute/admin.employee.route';

const adminRouter = Router();

adminRouter.use('/auth', authRoutes);
adminRouter.use('/courses', courseRoutes);
adminRouter.use('/students', studentRoutes);
adminRouter.use('/teachers', teacherRoutes);
adminRouter.use('/companies', companyRoutes);
adminRouter.use('/subscriptions', subscriptionRoutes);
adminRouter.use('/orders', orderRoutes);
adminRouter.use('/profile', profileRoutes);
// adminRouter.use('/employees', employeeRoutes);
import transactionRoutes from './adminRoute/admin.transaction.route';
adminRouter.use('/transactions', transactionRoutes);

import reportsRoutes from './adminRoute/admin.reports.route';
adminRouter.use('/reports', reportsRoutes);

export default adminRouter;
