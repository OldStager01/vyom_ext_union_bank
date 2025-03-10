import { Router } from "express";
import { panVerificationController } from "../../controllers/users/register/index";

const router = Router();

// STEP 1
router.post("/pan-verify", panVerificationController);

export default router;
