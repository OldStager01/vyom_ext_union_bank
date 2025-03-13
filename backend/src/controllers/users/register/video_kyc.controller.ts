import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/authRequest.type";
import { UnauthorizedError, ValidationError } from "../../../utils/errors";
import { ApiResponse } from "../../../utils/ApiResponse";
import { agentAllotment } from "../../../services/user/register/video_kyc/agentAllotment.service";
import { VideoKycSessionStatusType } from "../../../types/tables/video_kyc_session.type";
import { kycStatusUpdate } from "../../../services/user/register/video_kyc/kycStatusUpdate.service";

export const vkycAgentAllotmentController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const id = req?.user?.id;
    try {
        if (!id) throw new UnauthorizedError("Unauthorized: No user found");
        const { language } = req.body;
        if (!language) throw new ValidationError("Language is required");

        const { employee, meet_link } = await agentAllotment(id, language);
        ApiResponse.send(res, 200, "Agent allotted successfully", {
            agent: employee,
            meet_link,
        });
    } catch (error) {
        next(error);
    }
};

export const vkycStatusUpdateController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const agent_id = req?.user?.id;
    try {
        if (!agent_id)
            throw new UnauthorizedError("Unauthorized: No user found");
        const status: VideoKycSessionStatusType = req.body.status;
        const { kyc_session_id } = req.body;
        if (!status) throw new ValidationError("Status is required");

        await kycStatusUpdate(agent_id, kyc_session_id, status);

        ApiResponse.send(res, 200, "Status updated successfully", {
            next_step: "account",
        });
    } catch (error) {
        next(error);
    }
};
