import { Router } from "express";
import { vkycStatusUpdateController } from "../../../controllers/users/register/video_kyc.controller";
import { getAccountProductsController } from "../../../controllers/employees/account_products.controller";

const router = Router();

// KYC
router.post("/vkyc-update", vkycStatusUpdateController);

export default router;
