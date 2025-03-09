import dotenv from "dotenv";
import { EnvSchema } from "../schemas/env.schema";
dotenv.config();

const envObj = {
    PORT: process.env.PORT || 3000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    DB_URL:
        process.env.DB_URL ||
        "postgres://user:password@localhost:5432/banking_db",
    JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
    NODE_ENV: process.env.NODE_ENV || "development",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRY || "7d",
};

const env = EnvSchema.parse(envObj);

export default env;
