import { Router } from "express";
import { panVerificationController } from "../../controllers/users/register/index";
import {
    sendAadharVerificationController,
    verifyAadharVerificationController,
} from "../../controllers/users/register/aadhar_verification.controller";

const router = Router();

// STEP 1
router.post("/pan-verify", panVerificationController);

// STEP 2
router.post("/aadhar-send-otp", sendAadharVerificationController);
router.post("/aadhar-verify-otp", verifyAadharVerificationController);

export default router;
