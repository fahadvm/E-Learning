import { Router } from 'express';


import authRoutes from './sharedRoute/shared.auth.route';
import notificationRoutes from './sharedRoute/shared.notification.route';

const sharedRoutes = Router();



sharedRoutes.use('/auth', authRoutes);
sharedRoutes.use('/notification', notificationRoutes);




export default sharedRoutes;
