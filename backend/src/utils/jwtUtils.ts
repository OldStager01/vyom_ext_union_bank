import { UUIDTypes } from "uuid";

import jwt from "jsonwebtoken";
import env from "../config/env";

const generateAccessToken = (id: UUIDTypes, role: string) => {
    return jwt.sign({ id, role }, env.ACCESS_TOKEN_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRATION || "15m",
    } as jwt.SignOptions);
};

const generateRefreshToken = (id: UUIDTypes, role: string) => {
    return jwt.sign({ id, role }, env.REFRESH_TOKEN_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRATION || "7d",
    } as jwt.SignOptions);
};

export { generateAccessToken, generateRefreshToken };
