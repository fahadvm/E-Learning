import { Router } from 'express';


import authRoutes from './sharedRoute/shared.auth.route';
import notificationRoutes from './sharedRoute/shared.notification.route';
import aiTutorRoutes from './sharedRoute/shared.ai.route';
// import compilerRoutes from './sharedRoute/shared.compiler.route';

import uploadRoutes from './sharedRoute/shared.upload.route';
import webrtcRoutes from './sharedRoute/shared.webrtc.route';

const sharedRoutes = Router();



sharedRoutes.use('/auth', authRoutes);
sharedRoutes.use('/notification', notificationRoutes);
sharedRoutes.use('/ai', aiTutorRoutes);
sharedRoutes.use('/compiler', aiTutorRoutes);
sharedRoutes.use('/', uploadRoutes);
sharedRoutes.use('/webrtc', webrtcRoutes);




export default sharedRoutes;
