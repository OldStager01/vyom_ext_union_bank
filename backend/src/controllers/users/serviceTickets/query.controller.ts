import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/authRequest.type";
import { UnauthorizedError, ValidationError } from "../../../utils/errors";
import { ApiResponse } from "../../../utils/ApiResponse";
import { queryUploadService } from "../../../services/user/serviceTicket/queryUpload.service";

export const queryUploadController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const id = req?.user?.id;
    if (!id) throw new UnauthorizedError("Unauthorized: No user found");
    try {
        const {
            query_type,
            query_text,
            predefined_query,
            category,
            sub_category,
        } = req.body;
        const file = req.body?.fileUrls[0];

        await queryUploadService({
            user_id: id,
            query_type,
            query_text,
            predefined_query,
            category,
            sub_category,
            video_url: file,
        });

        ApiResponse.send(res, 200, "Query uploaded successfully");
    } catch (error) {
        next(error);
    }
};
