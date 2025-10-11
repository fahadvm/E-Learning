import { Router } from 'express';

import authRoutes from './studentRoute/student.auth.route';
import profileRoutes from './studentRoute/student.profile.route';
import courseRoutes from './studentRoute/student.course.route';
import subscriptionRoutes from './studentRoute/student.subscription.route';
import wishlistRoutes from './studentRoute/student.wishlist.route';
import cartRoutes from './studentRoute/student.cart.route';
import purchaseRoutes from './studentRoute/student.purchase.routes';
import bookingRoutes from './studentRoute/student.booking.routes';
import teacherRoutes from './studentRoute/student.teacher.route';
import chatRoutes from './studentRoute/student.chat.route';
import notificationRoutes from './studentRoute/student.notification.route';

const studentRouter = Router();

studentRouter.use('/auth', authRoutes);
studentRouter.use('/profile', profileRoutes);
studentRouter.use('/courses', courseRoutes);
studentRouter.use('/subscriptions', subscriptionRoutes);
studentRouter.use('/wishlist', wishlistRoutes);
studentRouter.use('/cart', cartRoutes);
studentRouter.use('/purchase', purchaseRoutes);
studentRouter.use('/bookings', bookingRoutes);
studentRouter.use('/teacher', teacherRoutes);
studentRouter.use('/chat', chatRoutes);
studentRouter.use('/notification', notificationRoutes);



export default studentRouter;
