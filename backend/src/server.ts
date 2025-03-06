import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import logger from "./config/logger";
import errorHandler from "./middlewares/error.middleware";
import env from "./config/env";
import { runMigrations } from "./db/init";
// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = env.PORT || 3000;

// Security Middleware
app.use(helmet());

// Compression Middleware
app.use(compression());

// CORS Middleware
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Logging Middleware (Morgan + Winston)
app.use(
    morgan("combined", {
        stream: { write: (message: string) => logger.info(message.trim()) },
    })
);

// JSON & URL-Encoded Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello, World!" });
});

app.get("/test", async (req: Request, res: Response) => {
    await runMigrations();
    res.status(200).json({ message: "Hello, World!" });
});

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Not Found" });
});

// Global Error Handler
app.use(errorHandler);

// 🚀 Start Server
app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
