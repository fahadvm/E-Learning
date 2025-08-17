import { Router } from 'express';

import authRoutes from './companyRoute/company.auth.route';
import profileRoutes from './companyRoute/company.profile.route';
import courseRoutes from './companyRoute/company.course.route';
import subscriptionRoutes from './companyRoute/company.subscription.route';
import employeeRoutes from './companyRoute/company.employee.route';

const companyRouter = Router();

companyRouter.use('/auth', authRoutes);
companyRouter.use('/profile', profileRoutes);
companyRouter.use('/courses', courseRoutes);
companyRouter.use('/subscriptions', subscriptionRoutes);
companyRouter.use('/employees', employeeRoutes);

export default companyRouter;
