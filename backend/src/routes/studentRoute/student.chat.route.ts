import { Router } from 'express';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { ChatController } from '../../controllers/student/student.chat.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();
const chatController = container.get<ChatController>(TYPES.ChatController);

router.get('/messages/:chatId',authMiddleware('student'), asyncHandler(chatController.getMessages.bind(chatController)));
router.get('/:chatId',authMiddleware('student'), asyncHandler(chatController.getChatDetails.bind(chatController)));
router.get('/',authMiddleware('student'), asyncHandler(chatController.getUserChats.bind(chatController)));
router.post('/start',authMiddleware('student'), asyncHandler(chatController.startChat.bind(chatController)));

export default router;
