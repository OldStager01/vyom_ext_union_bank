import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../../../config/env";
import { getUsers, updateUser } from "../../../db/models/users";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../../utils/jwtUtils";
import { AuthRequest } from "../../../types/authRequest.type";

// Refresh Token API
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.headers["x-refresh-token"] as string;

        if (!refreshToken) {
            res.status(401).json({
                error: "Unauthorized: No refresh token provided",
            });
            return;
        }

        // Verify and decode refresh token
        let decoded;
        try {
            decoded = jwt.verify(
                refreshToken,
                env.REFRESH_TOKEN_SECRET as string
            );
        } catch (error) {
            res.status(403).json({
                error: "Invalid refresh token. Please log in again.",
            });
            return;
        }

        const userId = (decoded as { id: string }).id;

        // Fetch user by decoded user ID
        const users = await getUsers({
            where: [{ column: "id", operator: "=", value: userId }],
        });

        if (users.length === 0) {
            res.status(403).json({
                error: "Invalid refresh token. Please log in again.",
            });
            return;
        }

        const user = users[0];
        console.log(user);
        // Security: If refresh token does not match, logout user
        if (refreshToken !== user.refresh_token) {
            await updateUser(
                { refresh_token: null },
                { where: [{ column: "id", operator: "=", value: userId }] }
            );
            res.status(403).json({
                error: "Suspicious activity detected. Please log in again.",
            });
            return;
        }

        // Generate new tokens (ROTATION)
        const newAccessToken = generateAccessToken(userId);
        const newRefreshToken = generateRefreshToken(userId);

        // Update refresh token in DB (Invalidate Old Token)
        await updateUser(
            { refresh_token: newRefreshToken },
            { where: [{ column: "id", operator: "=", value: userId }] }
        );

        // Send new tokens in response headers
        res.setHeader("x-access-token", newAccessToken);
        res.setHeader("x-refresh-token", newRefreshToken);

        res.json({ message: "Token refreshed successfully" });
        return;
    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};

// Logout API

export const logout = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id; // Assuming user ID is available in `req.user` from middleware

        if (!userId) {
            res.status(401).json({ error: "Unauthorized: No user found" });
            return;
        }

        // Remove refresh token from the database
        await updateUser(
            { refresh_token: null },
            { where: [{ column: "id", operator: "=", value: userId }] }
        );

        res.json({ message: "Logged out successfully" });
        return;
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};
