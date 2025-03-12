import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/authRequest.type";
import { UnauthorizedError } from "../../utils/errors";
import { createBranch } from "../../services/branch/create_branch.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const createBranchController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req?.user?.id;
        const role = req?.user?.role;
        const { branch_code, branch_name, address, phone } = req.body;

        if (!id || !role || role === "user")
            throw new UnauthorizedError("Unauthorized: No user found");

        await createBranch(branch_code, branch_name, address, phone);

        ApiResponse.send(res, 201, "Branch Created");
    } catch (error) {
        next(error);
    }
};
