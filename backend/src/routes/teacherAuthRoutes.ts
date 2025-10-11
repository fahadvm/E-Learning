import { Router } from 'express';

import authRoutes from './teacherRoute/teacher.auth.route';
import profileRoutes from './teacherRoute/teacher.profile.route';
import courseRoutes from './teacherRoute/teacher.course.route';
import availabilityRoutes from './teacherRoute/teacher.availability.route';
import callRequestRoutes from './teacherRoute/teacher.call.request.route';
import chatRoutes from './teacherRoute//teacher.chat.route';
 
const teacherRouter = Router();

teacherRouter.use('/auth', authRoutes);
teacherRouter.use('/profile', profileRoutes);
teacherRouter.use('/courses', courseRoutes);
teacherRouter.use('/availability',availabilityRoutes)
teacherRouter.use('/call-request',callRequestRoutes)
teacherRouter.use('/chat',chatRoutes)

export default teacherRouter;
