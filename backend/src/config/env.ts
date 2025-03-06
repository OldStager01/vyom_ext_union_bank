import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT || 3000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    DB_URL:
        process.env.DB_URL ||
        "postgres://user:password@localhost:5432/banking_db",
    JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
    NODE_ENV: process.env.NODE_ENV || "development",
};
