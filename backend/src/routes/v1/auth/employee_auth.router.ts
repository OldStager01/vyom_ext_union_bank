import { Router } from "express";
import {
    employeeLogInController,
    employeeSignUpController,
} from "../../../controllers/employee_auth.controller";
import authMiddleware from "../../../middlewares/auth.middleware";

const router = Router();

router.post("/sign-up", employeeSignUpController);
router.post("/login", employeeLogInController);
router.post("/test", authMiddleware, (req, res) => {
    res.send("Hello World");
});

export default router;
