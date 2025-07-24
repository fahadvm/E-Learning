import express from "express";
import container from "../core/di/container";
import { AdminAuthController } from "../controllers/admin/AdminAuthController";

const router = express.Router();

const adminAuthController = container.get<AdminAuthController>("AdminAuthController");

router.post("/login", adminAuthController.login.bind(adminAuthController));
router.post("/logout", adminAuthController.logout.bind(adminAuthController));
router.get("/users", adminAuthController.getAllUsers.bind(adminAuthController));
router.get("/companies", adminAuthController.getAllCompanies.bind(adminAuthController));

export default router;
