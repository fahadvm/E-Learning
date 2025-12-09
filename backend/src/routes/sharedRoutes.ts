import { Router } from 'express';


import authRoutes from './sharedRoute/shared.auth.route';
import notificationRoutes from './sharedRoute/shared.notification.route';
import aiTutorRoutes from './sharedRoute/shared.ai.route';
// import compilerRoutes from './sharedRoute/shared.compiler.route';

import uploadRoutes from './sharedRoute/shared.upload.route';

const sharedRoutes = Router();



sharedRoutes.use('/auth', authRoutes);
sharedRoutes.use('/notification', notificationRoutes);
sharedRoutes.use('/ai', aiTutorRoutes);
sharedRoutes.use('/compiler', aiTutorRoutes);
sharedRoutes.use('/', uploadRoutes);




export default sharedRoutes;
