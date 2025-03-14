import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/authRequest.type";
import {
    NotFoundError,
    UnauthorizedError,
    ValidationError,
} from "../../../utils/errors";
import { ApiResponse } from "../../../utils/ApiResponse";

export const videoQueryUploadController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const id = req?.user?.id;
    if (!id) throw new UnauthorizedError("Unauthorized: No user found");
    try {
        const { query } = req.body;
        const file = req.file;
        if (!file) throw new ValidationError("Video is required");
    } catch (error) {
        next(error);
    }
};
