import { Router } from "express";
import { vkycStatusUpdateController } from "../../../controllers/users/register/video_kyc.controller";

const router = Router();

router.post("/vkyc-update", vkycStatusUpdateController);

export default router;
