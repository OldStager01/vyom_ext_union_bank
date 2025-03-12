import { Router } from "express";
import { createBranchController } from "../../../controllers/branch/createBranch.controller";

const router = Router();

router.post("/create", createBranchController);

export default router;
