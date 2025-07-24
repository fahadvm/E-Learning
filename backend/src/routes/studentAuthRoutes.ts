import express from "express";
import container from "../core/di/container";
import { StudentAuthController } from "../controllers/student/StudentAuthController";

const router = express.Router();

const studentAuthController = container.get<StudentAuthController>("StudentAuthController");

// router.post("/signup", studentAuthController.signup.bind(studentAuthController));


router.post("/login", studentAuthController.login.bind(studentAuthController));
router.post("/signup", studentAuthController.signup.bind(studentAuthController));
router.post("/verifyOtp", studentAuthController.verifyOtp.bind(studentAuthController));
router.post("/logout", studentAuthController.logout.bind(studentAuthController));



router.post('/google/signup',studentAuthController.googleAuth.bind(studentAuthController))



router.post("/forgot-password",studentAuthController.sendForgotPasswordOtp.bind(studentAuthController));
router.post("/verify-forgot-otp",studentAuthController.verifyForgotOtp.bind(studentAuthController));
router.post("/set-new-password",studentAuthController.setNewPassword.bind(studentAuthController));
router.post("/resend-otp",studentAuthController.resendOtp.bind(studentAuthController));





export default router;
