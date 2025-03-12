import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { AuthRequest } from "../types/authRequest.type";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import { getUser } from "../services/user/getUser.service";
import { getEmployee } from "../services/employee/getEmployee.service";

// Middleware for verifying access tokens
const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Unauthorized: No access token found");
        }

        const accessToken = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(
                accessToken,
                env.ACCESS_TOKEN_SECRET as string
            ) as { id: string; role: string };
            if (decoded.role === "user") {
                const user = await getUser(decoded.id);
                if (user.length === 0) {
                    throw new UnauthorizedError("Invalid Token");
                }
            } else if (decoded.role === "employee") {
                const employee = await getEmployee(decoded.id);
                if (employee.length === 0) {
                    throw new UnauthorizedError("Invalid Token");
                }
            } else {
                throw new UnauthorizedError("Invalid Token");
            }
            req.user = { id: decoded.id, role: decoded.role };
            return next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                console.log("Token expired");
                throw new UnauthorizedError("Unauthorized: Token expired");
            }
            throw new ForbiddenError("Forbidden: Invalid access token");
        }
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;
