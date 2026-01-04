import { Router } from 'express';

import authRoutes from './employeeRoute/employee.auth.route';
import profileRoutes from './employeeRoute/employee.profile.route';
import companyRoutes from './employeeRoute/employee.company.route';
import courseRoutes from './employeeRoute/employee.courses.route';
import learningPathRoutes from './employeeRoute/employee.learningpath.route';
import leaderBoardRoutes from './employeeRoute/employee.leaderboard.route';
import chatRoutes from './employeeRoute/employee.chat.route';
import teacherRoutes from './employeeRoute/employee.teacher.route';

const employeeRouter = Router();

employeeRouter.use('/auth', authRoutes);
employeeRouter.use('/profile', profileRoutes);
employeeRouter.use('/company', companyRoutes);
employeeRouter.use('/courses', courseRoutes);
employeeRouter.use('/progress', courseRoutes);
employeeRouter.use('/leaderboard', courseRoutes);
employeeRouter.use('/progress', courseRoutes);
employeeRouter.use('/learning-paths', learningPathRoutes);
employeeRouter.use('/leaderboard', leaderBoardRoutes);
employeeRouter.use('/chat', chatRoutes);
employeeRouter.use('/teachers', teacherRoutes);





export default employeeRouter;
