import { UUIDTypes } from "uuid";

import jwt from "jsonwebtoken";
import env from "../config/env";

const generateAccessToken = (userId: UUIDTypes) => {
    return jwt.sign({ userId }, env.ACCESS_TOKEN_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRATION || "15m",
    } as jwt.SignOptions);
};

const generateRefreshToken = (userId: UUIDTypes) => {
    return jwt.sign({ userId }, env.REFRESH_TOKEN_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRATION || "7d",
    } as jwt.SignOptions);
};

export { generateAccessToken, generateRefreshToken };
