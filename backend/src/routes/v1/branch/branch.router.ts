import { Router } from "express";
import { createBranchController } from "../../../controllers/branch/create_branch.controller";

const router = Router();

router.post("/create", createBranchController);

export default router;
