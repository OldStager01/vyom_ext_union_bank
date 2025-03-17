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
    console.log(req.body);
    const id = req?.user?.id;
    if (!id) throw new UnauthorizedError("Unauthorized: No user found");
    try {
        const { query_type, query_text, predefined_query } = req.body;
        const file = req.body?.fileUrls?.video;
        await queryUploadService({
            user_id: id,
            query_type,
            query_text,
            video_url: file,
            predefined_query,
        });

        ApiResponse.send(res, 200, "Query uploaded successfully");
    } catch (error) {
        console.log(error);
        next(error);
    }
};
