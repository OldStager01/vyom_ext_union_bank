import { Router } from "express";
import {
    employeeLogInController,
    employeeSignUpController,
} from "../../../controllers/employee_auth.controller";
import authMiddleware from "../../../middlewares/auth.middleware";
import { getUserController } from "../../../controllers/auth.controller";
import { userTypeMiddleware } from "../../../middlewares/userType.middleware";

const router = Router();

router.post("/sign-up", employeeSignUpController);
router.post("/login", employeeLogInController);
router.post("/test", authMiddleware, (req, res) => {
    res.send("Hello World");
});
router.get(
    "/me",
    authMiddleware,
    // userTypeMiddleware("employee"),
    getUserController
);

export default router;
