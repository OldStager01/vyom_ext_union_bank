import { Router } from "express";
import {
    createAccountProductsController,
    getAccountProductsController,
} from "../../../controllers/employees/account_products.controller";

const router = Router();

// ACCOUNTS
// Create account products
router.get("/", getAccountProductsController);
router.post("/", createAccountProductsController);

export default router;
