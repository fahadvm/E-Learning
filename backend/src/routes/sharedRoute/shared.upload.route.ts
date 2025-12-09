import express from 'express';
import multer from 'multer';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { SharedController } from '../../controllers/shared/shared.controller';
import { asyncHandler } from '../../middleware/asyncHandler';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const sharedController = container.get<SharedController>(TYPES.SharedController);

router.post('/upload', upload.single('file'), asyncHandler(sharedController.uploadFile.bind(sharedController)));

export default router;
