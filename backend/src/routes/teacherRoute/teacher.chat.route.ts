import { Router } from "express";
import container from '../../core/di/container';
import { TYPES } from "../../core/di/types";
import { TeacherChatController } from "../../controllers/teacher/teacher.chat.controller";
import { asyncHandler } from "../../middleware/asyncHandler";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();
const chatController = container.get<TeacherChatController>(TYPES.TeacherChatController);

router.get("/messages/:chatId",authMiddleware('teacher'), asyncHandler(chatController.getMessages.bind(chatController)));
router.get("/:chatId",authMiddleware('teacher'), asyncHandler(chatController.getChatDetails.bind(chatController)));
router.get("/",authMiddleware('teacher'), asyncHandler(chatController.getUserChats.bind(chatController)));
router.post("/start",authMiddleware('teacher'), asyncHandler(chatController.startChat.bind(chatController)));

export default router;
