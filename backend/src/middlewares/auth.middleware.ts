import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { AuthRequest } from "../types/authRequest.type";

// Middleware for verifying access tokens
const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "Unauthorized: Missing token" });
            return;
        }

        const accessToken = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(
                accessToken,
                env.ACCESS_TOKEN_SECRET as string
            ) as { id: string };
            console.log("Decoded:", decoded);
            req.user = { id: decoded.id };
            return next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                console.log("Token expired");
                res.status(401).json({
                    error: "Token expired. Please refresh your token.",
                });
                return;
            }
            res.status(403).json({ error: "Invalid access token" });
            return;
        }
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};

export default authMiddleware;
