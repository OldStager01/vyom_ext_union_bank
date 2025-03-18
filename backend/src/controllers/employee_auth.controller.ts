import { NextFunction, Request, Response } from "express";
import { UnauthorizedError, ValidationError } from "../utils/errors";
import { signUpEmployee } from "../services/employee/signup.service";
import { ApiResponse } from "../utils/ApiResponse";
import { getRecords, updateRecord } from "../db/models/records";
import { tables } from "../db/tables";
import { EmployeeType } from "../types/tables/employee.type";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils";
import { UUIDTypes } from "uuid";
export const employeeSignUpController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            branch_id,
            name,
            email,
            phone,
            password,
            roles,
            spoken_languages,
        } = req.body;
        if (
            !branch_id ||
            !name ||
            !email ||
            !phone ||
            !password ||
            !roles ||
            roles.length === 0 ||
            !Array.isArray(spoken_languages) ||
            spoken_languages.length === 0
        )
            throw new ValidationError("All Fields are Required");

        await signUpEmployee(
            branch_id,
            name,
            email,
            phone,
            password,
            roles,
            spoken_languages
        );

        ApiResponse.send(res, 200, "Employee created successfully");
    } catch (error) {
        next(error);
    }
};

export const employeeLogInController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        const employee = await getRecords<EmployeeType>(tables.employees, {
            where: [
                {
                    column: "email",
                    operator: "=",
                    value: email,
                },
            ],
        });

        if (employee.length === 0)
            throw new UnauthorizedError("User not found");
        const isMatch = await bcrypt.compare(
            password,
            employee[0]?.password as string
        );
        if (!isMatch)
            throw new UnauthorizedError(
                "Unauthorised: Incorrect email or password"
            );

        const accessToken = generateAccessToken(
            employee[0]?.id as UUIDTypes,
            "employee"
        );
        const refreshToken = generateRefreshToken(
            employee[0]?.id as UUIDTypes,
            "employee"
        );

        await updateRecord<EmployeeType>(
            tables.employees,
            {
                refresh_token: refreshToken,
            },
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: employee[0]?.id as UUIDTypes,
                    },
                ],
            }
        );
        res.setHeader("x-access-token", accessToken);
        res.setHeader("x-refresh-token", refreshToken);

        res.cookie("se", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        });

        ApiResponse.send(res, 200, "Logged In", {
            accessToken,
            user: employee[0],
        });
    } catch (error) {
        next(error);
    }
};
