import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import env from "../config/env";
import { getUsers, updateUser } from "../db/models/users";
import { UserType } from "../types/tables/user.type";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils";
// Zod Schema for validating JWTs
const TokenSchema = z.object({
    authorization: z
        .string()
        .regex(
            /^Bearer\s[\w-]*\.[\w-]*\.[\w-]*$/,
            "Invalid Authorization Header"
        ),
    "x-refresh-token": z.string().min(10, "Invalid Refresh Token").optional(),
});

// Type for Express Request with Auth Data
interface AuthRequest extends Request {
    user?: { id: string };
}

// Middleware Function
const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate Headers with Zod
        const parsedHeaders = TokenSchema.safeParse(req.headers);
        if (!parsedHeaders.success) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Invalid headers" });
        }

        const authHeader = parsedHeaders.data.authorization;
        const accessToken = authHeader.split(" ")[1];

        let decoded;
        try {
            // Verify Access Token
            decoded = jwt.verify(
                accessToken,

                env.ACCESS_TOKEN_SECRET as string
            ) as { userId: string };
            req.user = { id: decoded.userId };
            return next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                console.warn("Access token expired, checking refresh token...");
            } else {
                return res.status(403).json({ error: "Invalid access token" });
            }
        }

        // If Access Token is expired, check refresh token
        const refreshToken = parsedHeaders.data["x-refresh-token"];
        if (!refreshToken) {
            return res
                .status(401)
                .json({ error: "Session expired. Please log in again." });
        }

        // Validate refresh token in DB
        const tokenResult = await getUsers({
            where: [
                {
                    column: "refresh_token",
                    operator: "=",
                    value: refreshToken,
                },
            ],
        });
        if (tokenResult.length === 0) {
            return res
                .status(403)
                .json({ error: "Invalid refresh token. Please log in again." });
        }

        // Verify Refresh Token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string,
            async (err, refreshDecoded) => {
                if (err) {
                    return res.status(403).json({
                        error: "Invalid refresh token. Please log in again.",
                    });
                }

                const userId = (refreshDecoded as { userId: string }).userId;

                // Generate new tokens
                const newAccessToken = generateAccessToken(userId);
                const newRefreshToken = generateRefreshToken(userId);

                // Update refresh token in DB
                await updateUser<UserType>(
                    {
                        refresh_token: newRefreshToken,
                    },
                    {
                        where: [
                            {
                                column: "id",
                                operator: "=",
                                value: userId,
                            },
                        ],
                    }
                );

                // Attach new tokens to response headers
                res.setHeader("x-access-token", newAccessToken);
                res.setHeader("x-refresh-token", newRefreshToken);

                req.user = { id: userId };
                next();
            }
        );
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default authMiddleware;
