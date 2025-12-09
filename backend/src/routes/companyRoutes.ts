import { Router } from 'express';

import authRoutes from './companyRoute/company.auth.route';
import profileRoutes from './companyRoute/company.profile.route';
import courseRoutes from './companyRoute/company.course.route';
import subscriptionRoutes from './companyRoute/company.subscription.route';
import employeeRoutes from './companyRoute/company.employee.route';
import wishlistRoutes from './companyRoute/company.wishlist.route';
import cartRoutes from './companyRoute/company.cart.route';
import purchaseRoutes from './companyRoute/company.purchase.route';
import learningPathRoutes from './companyRoute/company.learningpath.route';
import leaderboard from './companyRoute/company.leaderboard.route';
import analytics from './companyRoute/company.analytics.route';
import chatRoutes from './companyRoute/company.chat.route';


const companyRouter = Router();

companyRouter.use('/auth', authRoutes);
companyRouter.use('/profile', profileRoutes);
companyRouter.use('/courses', courseRoutes);
companyRouter.use('/subscriptions', subscriptionRoutes);
companyRouter.use('/employees', employeeRoutes);
companyRouter.use('/wishlist', wishlistRoutes);
companyRouter.use('/cart', cartRoutes);
companyRouter.use('/purchase', purchaseRoutes);
companyRouter.use('/learning-paths', learningPathRoutes);
companyRouter.use('/leaderboard', leaderboard);
companyRouter.use('/analytics', analytics);
companyRouter.use('/chat', chatRoutes);

export default companyRouter;
