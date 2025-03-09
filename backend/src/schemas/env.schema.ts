import { z } from "zod";

export const EnvSchema = z.object({
    PORT: z.string().optional(),
    CORS_ORIGIN: z.string().nonempty(),
    DB_URL: z.string().nonempty(),
    JWT_SECRET: z.string().nonempty(),
    NODE_ENV: z.enum(["development", "testing", "production"]),

    ACCESS_TOKEN_SECRET: z.string().nonempty(),
    ACCESS_TOKEN_EXPIRATION: z.string().nonempty(),
    REFRESH_TOKEN_SECRET: z.string().nonempty(),
    REFRESH_TOKEN_EXPIRATION: z.string().nonempty(),

    CLOUDINARY_CLOUD_NAME: z.string().nonempty(),
    CLOUDINARY_API_KEY: z.string().nonempty(),
    CLOUDINARY_API_SECRET: z.string().nonempty(),

    REDIS_HOST: z.string().nonempty(),
    REDIS_PORT: z.string().optional(),
    REDIS_PASSWORD: z.string().nonempty(),
});
