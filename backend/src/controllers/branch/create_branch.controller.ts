import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/authRequest.type";
import { createBranch } from "../../services/branch/create_branch.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const createBranchController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            branch_code,
            branch_name,
            address,
            city,
            state,
            pin_code,
            phone,
        } = req.body;

        await createBranch(
            branch_code,
            branch_name,
            address,
            city,
            state,
            pin_code,
            phone
        );

        ApiResponse.send(res, 201, "Branch Created");
    } catch (error) {
        next(error);
    }
};
