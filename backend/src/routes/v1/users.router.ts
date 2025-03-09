import { Router } from "express";
import { UserSchema } from "../../schemas/user.schema";
import {
    phoneControllerSend,
    phoneControllerVerify,
} from "../../controllers/users/register/phone.controller";

const router = Router();

// STEP 1
router.post("/auth/get-otp", phoneControllerSend);
router.post("/auth/verify-otp", phoneControllerVerify);

export default router;
