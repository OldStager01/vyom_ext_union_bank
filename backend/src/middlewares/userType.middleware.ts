import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authRequest.type";
import { ForbiddenError } from "../utils/errors";

export const userTypeMiddleware = (userType: "employee" | "user") => {
    return async function (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const id = req?.user?.id;
            const role = req?.user?.role;
            if (!id || !role) {
                throw new ForbiddenError("Forbidden");
            }
            if (role !== userType) {
                throw new ForbiddenError("Forbidden: Invalid user type");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
