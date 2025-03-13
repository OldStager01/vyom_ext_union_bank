import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/authRequest.type";
import { UnauthorizedError, ValidationError } from "../../../utils/errors";
import { ApiResponse } from "../../../utils/ApiResponse";
import { createAccount } from "../../../services/user/register/account/createAccount.service";

export const accountCreateController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req?.user?.id;
        if (!id) throw new UnauthorizedError("Unauthorized: No user found");
        const { product_id, initial_balance } = req.body;
        if (!product_id || initial_balance == null || initial_balance < 0)
            throw new ValidationError("Enter Valid Data");
        await createAccount(id, product_id, initial_balance);
        ApiResponse.send(res, 200, "Account created successfully");
    } catch (error) {
        next(error);
    }
};
