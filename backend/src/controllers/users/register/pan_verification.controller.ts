import { Response } from "express";
import { verifyPan } from "../../../services/user/register/verifyPan";
import { AuthRequest } from "../../../types/authRequest.type";
import { updateUser } from "../../../db/models/users";
import { UserType } from "../../../types/tables/user.type";
import { ApiResponse } from "../../../utils/ApiResponse";
import { ApiError } from "../../../utils/ApiError";
export const panVerificationController = async (
    req: AuthRequest,
    res: Response
) => {
    const { pan_number, name, dob } = req.body;
    const id = req?.user?.id;
    if (!id) {
        res.status(401).json(new ApiError(401, "Unauthorized: No user found"));
        return;
    }

    if (!pan_number) {
        res.status(400).json(new ApiError(400, "Pan number is required"));
        return;
    }
    if (!name) {
        res.status(400).json(new ApiError(400, "Name is required"));
        return;
    }
    if (!dob) {
        res.status(400).json(new ApiError(400, "Date of birth is required"));
        return;
    }
    try {
        await verifyPan(id, pan_number, name, dob);

        res.status(200).json(
            new ApiResponse(200, {
                message: "Pan verified successfully",
                next_step: "aadhaar",
                user: {
                    name,
                },
            })
        );
    } catch (error) {
        res.status(500).json(new ApiError(500, "Failed to verify pan"));
        return;
    }
};
