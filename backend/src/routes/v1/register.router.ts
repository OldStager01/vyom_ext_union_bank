import { Router } from "express";
import { panVerificationController } from "../../controllers/users/register/index";
import {
    sendAadharVerificationController,
    verifyAadharVerificationController,
} from "../../controllers/users/register/aadhar_verification.controller";
import { otherDetailsController } from "../../controllers/users/register/other_details.controller";
import { faceRegistrationController } from "../../controllers/users/register/face_registration.controller";

const router = Router();

// STEP 1
router.post("/pan-verify", panVerificationController);

// STEP 2
router.post("/aadhar-send-otp", sendAadharVerificationController);
router.post("/aadhar-verify-otp", verifyAadharVerificationController);

// STEP 3
router.post("/other-details", otherDetailsController);

// STEP 4
router.post("/face-registration", faceRegistrationController);

export default router;
