import { Router } from 'express';

import authRoutes from './employeeRoute/employee.auth.route';
import profileRoutes from './employeeRoute/employee.profile.route';
import companyRoutes from './employeeRoute/employee.company.route';
import courseRoutes from './employeeRoute/employee.courses.route';
import learningPathRoutes from './employeeRoute/employee.learningpath.route';




const employeeRouter = Router();

employeeRouter.use('/auth', authRoutes);
employeeRouter.use('/profile', profileRoutes);
employeeRouter.use('/company', companyRoutes);
employeeRouter.use('/courses', courseRoutes);
employeeRouter.use('/progress', courseRoutes);
employeeRouter.use('/leaderboard', courseRoutes);
employeeRouter.use('/progress', courseRoutes);
employeeRouter.use('/learning-paths', learningPathRoutes);





export default employeeRouter;
