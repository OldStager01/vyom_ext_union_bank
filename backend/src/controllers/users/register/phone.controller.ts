import { Request, Response } from "express";
import { sendOtp, verifyOtp } from "../../../services/otp.service";
import { ApiError } from "../../../utils/ApiError";
import { ApiResponse } from "../../../utils/ApiResponse";
import { createUser, getUsers } from "../../../db/models/users";
import { v4 as uuid } from "uuid";
import {
    UserSchemaForCreationType,
    UserType,
} from "../../../types/tables/user.type";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../../utils/jwtUtils";

export const phoneControllerSend = async (req: Request, res: Response) => {
    const { mobile_number } = req.body;
    if (!mobile_number) {
        res.status(400).json({ error: "Mobile number is required" });
        return;
    }
    try {
        // Send the OTP
        await sendOtp(mobile_number);

        // Check if the user exits
        const user = await getUsers({
            where: [
                {
                    column: "mobile_number",
                    operator: "=",
                    value: mobile_number,
                },
            ],
        });
        if (user.length > 0) {
            res.status(400).json({
                message: "OTP sent. Proceed to login",
                next_step: "login",
            });
            return;
        } else {
            res.status(400).json({
                message: "OTP sent. Proceed to login",
                next_step: "register",
            });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP" });
        return;
    }
};

export async function phoneControllerVerify(req: Request, res: Response) {
    const { mobile_number, otp } = req.body;
    if (!mobile_number) {
        res.status(400).json({ error: "Mobile number is required" });
        return;
    }
    if (!otp) {
        res.status(400).json({ error: "OTP is required" });
        return;
    }
    try {
        const result: Boolean = await verifyOtp(mobile_number, otp);
        if (!result) {
            throw new ApiError(400, "Invalid OTP");
        }
        // Check if user exists
        const user = await getUsers({
            where: [
                {
                    column: "mobile_number",
                    operator: "=",
                    value: mobile_number,
                },
            ],
        });
        let authUser: { id: string } & Partial<UserType>;
        if (user.length === 0) {
            const id = uuid();
            await createUser<UserSchemaForCreationType>({
                id,
                mobile_number,
                registration_status: "pending_pan_verification",
                created_at: new Date(),
                updated_at: new Date(),
            });
            authUser = {
                id,
                mobile_number,
                registration_status: "pending_pan_verification",
            };
        } else {
            authUser = user[0] as { id: string } & Partial<UserType>;
        }
        const accessToken = generateAccessToken(authUser.id);
        const refreshToken = generateRefreshToken(authUser.id);

        res.json(
            new ApiResponse(200, {
                message: "Phone Verified",
                id: authUser.id,
                mobile_number: authUser.mobile_number,
                registration_status: authUser.registration_status,
                access_token: accessToken,
                refresh_token: refreshToken,
            })
        );

        return;
    } catch (error) {
        console.error(error);
        res.json(new ApiResponse(500, { error }));
        return;
    }
}
