import { Router } from 'express';
import container from '../../core/di/container';
import { asyncHandler } from '../../middleware/asyncHandler';
import { authMiddleware} from '../../middleware/authMiddleware';
import { TYPES } from '../../core/di/types';
import { TeacherAvailabilityController } from '../../controllers/teacher/teacher.availability.controller';


const router = Router()
const availabilityCtrl = container.get<TeacherAvailabilityController>(TYPES.TeacherAvailabilityController)

router.post("/", authMiddleware('Teacher'), asyncHandler(availabilityCtrl.saveAvailability.bind(availabilityCtrl)))
router.get("/", authMiddleware('Teacher'), asyncHandler(availabilityCtrl.getMyAvailability.bind(availabilityCtrl)))

export default router
