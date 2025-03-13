import { Router } from "express";
import { vkycStatusUpdateController } from "../../../controllers/users/register/video_kyc.controller";
import { createAccountProductsController } from "../../../controllers/employees/accounts.controller";

const router = Router();

// KYC
router.post("/vkyc-update", vkycStatusUpdateController);

// ACCOUNTS
// Create account products
router.post("/account-products", createAccountProductsController);

export default router;
