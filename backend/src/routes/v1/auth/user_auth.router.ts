import { Router } from "express";
import {
    phoneControllerSend,
    phoneControllerVerify,
} from "../../../controllers/users/register/index";
import {
    getUserController,
    refreshToken,
} from "../../../controllers/auth.controller";
import authMiddleware from "../../../middlewares/auth.middleware";

const router = Router();

router.post("/get-otp", phoneControllerSend);
router.post("/verify-otp", phoneControllerVerify);
router.post("/refresh-token", refreshToken);

export default router;
