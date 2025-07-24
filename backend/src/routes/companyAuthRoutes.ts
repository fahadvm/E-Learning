import express from "express";
import container from "../core/di/container";
import { CompanyAuthController } from "../controllers/company/CompanyAuthController";
import { CompanyEmployeeController } from "../controllers/company/CompanyEmployeeController";

const router = express.Router();



const companyAuthController = container.get<CompanyAuthController>("CompanyAuthController");
const employeeController = container.get<CompanyEmployeeController>("CompanyEmployeeController");




router.post("/signup", companyAuthController.sendOtp.bind(companyAuthController));
router.post("/verify-otp", companyAuthController.verifyOtp.bind(companyAuthController));
router.post("/login", companyAuthController.login.bind(companyAuthController));
router.post('/logout',companyAuthController.logout.bind(companyAuthController))


router.post("/forgot-password", companyAuthController.forgotPassword.bind(companyAuthController));
router.post("/reset-password", companyAuthController.resetPassword.bind(companyAuthController));
router.post("/verify-forgot-otp",companyAuthController.verifyForgotOtp.bind(companyAuthController));
router.post("/resend-otp",companyAuthController.resendOtp.bind(companyAuthController));

router.post("/addemployee", employeeController.addEmployee.bind(employeeController));
router.get("/employees/:companyId", employeeController.getAllEmployees.bind(employeeController));
router.get("/employee/:id", employeeController.getEmployeeById.bind(employeeController));
router.patch("/employee/:id/block",employeeController.blockEmployee.bind(employeeController));



router.post("/unblock-employee",companyAuthController.resendOtp.bind(companyAuthController));


router.post("/editemployee",companyAuthController.resendOtp.bind(companyAuthController));
router.post("/remove-employee",companyAuthController.resendOtp.bind(companyAuthController));









export default router;
