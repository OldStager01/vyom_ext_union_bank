import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { getRecords, updateRecord } from "../db/models/records";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils";
import { AuthRequest } from "../types/authRequest.type";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";
import { ApiResponse } from "../utils/ApiResponse";
import { tables } from "../db/tables";
import { getUser } from "../services/user/getUser.service";
import { getEmployee } from "../services/employee/getEmployee.service";
import { query } from "../config/db";

// Refresh Token API
export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const refreshToken = req.headers["x-refresh-token"] as string;

        if (!refreshToken) {
            throw new ForbiddenError("No refresh token found");
        }

        // Verify and decode refresh token
        let decoded;
        try {
            decoded = jwt.verify(
                refreshToken,
                env.REFRESH_TOKEN_SECRET as string
            );
        } catch (error) {
            throw new ForbiddenError("Invalid refresh token");
        }

        const { id, role } = decoded as { id: string; role: string };

        if (role === "user") {
            const users = await getUser(id);

            if (users.length === 0) {
                throw new ForbiddenError(
                    "Invalid refresh token. Please log in again."
                );
            }
            const user = users[0];
            if (refreshToken !== user?.refresh_token) {
                await updateRecord(
                    tables.users,
                    { refresh_token: null, updated_at: new Date() },
                    { where: [{ column: "id", operator: "=", value: id }] }
                );
                throw new ForbiddenError(
                    "Invalid refresh token. Please log in again."
                );
            }
        } else if (role === "employee") {
            const employees = await getEmployee(id);

            if (employees.length === 0) {
                throw new ForbiddenError(
                    "Invalid refresh token. Please log in again"
                );
            }
            const employee = employees[0];
            if (refreshToken != employee?.refresh_token) {
                throw new ForbiddenError(
                    "Invalid refresh token. Please log in again"
                );
            }
        } else {
            throw new ForbiddenError(
                "Invalid refresh token. Please log in again"
            );
        }

        // Generate new tokens (ROTATION)
        const newAccessToken = generateAccessToken(id, role);
        const newRefreshToken = generateRefreshToken(id, role);

        // Update refresh token in DB (Invalidate Old Token)
        await updateRecord(
            tables.users,
            { refresh_token: newRefreshToken, updated_at: new Date() },
            { where: [{ column: "id", operator: "=", value: id }] }
        );

        // Send new tokens in response headers
        res.setHeader("x-access-token", newAccessToken);
        res.setHeader("x-refresh-token", newRefreshToken);

        ApiResponse.send(res, 200, "Tokens refreshed successfully");
        return;
    } catch (error) {
        next(error);
    }
};

// Logout API

export const logout = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id; // Assuming user ID is available in `req.user` from middleware
        const role = req.user?.role;
        if (!userId || !role) {
            throw new UnauthorizedError("Unauthorized: No user found");
        }
        // Remove refresh token from the database
        if (role === "user") {
            await updateRecord(
                tables.users,
                { refresh_token: null, updated_at: new Date() },
                { where: [{ column: "id", operator: "=", value: userId }] }
            );
        } else if (role === "employee") {
            await updateRecord(
                tables.employees,
                { refresh_token: null, updated_at: new Date() },
                { where: [{ column: "id", operator: "=", value: userId }] }
            );
        }

        ApiResponse.send(res, 200, "Logout successful");

        return;
    } catch (error) {
        next(error);
    }
};

// Get User API
export const getUserController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        if (!userId || !role) {
            throw new UnauthorizedError("Unauthorized: No user found");
        }

        const users = await getRecords(tables.employees, {
            where: [
                {
                    column: "id",
                    operator: "=",
                    value: userId,
                },
            ],
        });

        if (users.length === 0) {
            throw new ForbiddenError("User not found");
        }

        const user = users[0];

        ApiResponse.send(res, 200, "User fetched successfully", {
            user,
        });
    } catch (error) {
        next(error);
    }
};
