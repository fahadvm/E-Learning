import { Router } from 'express';

import authRoutes from './studentRoute/student.auth.route';
import profileRoutes from './studentRoute/student.profile.route';
import courseRoutes from './studentRoute/student.course.route';
import subscriptionRoutes from './studentRoute/student.subscription.route';

const studentRouter = Router();

studentRouter.use('/auth', authRoutes);
studentRouter.use('/profile', profileRoutes);
studentRouter.use('/courses', courseRoutes);
studentRouter.use('/subscriptions', subscriptionRoutes);

export default studentRouter;
