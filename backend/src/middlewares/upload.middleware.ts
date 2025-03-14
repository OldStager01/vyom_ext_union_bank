import { Request, Response, NextFunction } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { v4 as uuidv4 } from "uuid";
import streamifier from "streamifier";
import path from "path";

// Middleware Configuration Type
interface UploadFieldConfig {
    name: string;
    maxCount: number;
}

interface UploadOptions {
    fields: UploadFieldConfig[];
    acceptedTypes?: string[];
    maxSize?: number;
    minSize?: number;
    folder?: string;
}

// Configure Multer to Store Files in Memory (Avoid Disk Latency)
const storage = multer.memoryStorage();

// Secure File Filter
const fileFilter = (
    acceptedTypes?: string[],
    minSize?: number,
    maxSize?: number
) => {
    return (
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        if (acceptedTypes && !acceptedTypes.includes(file.mimetype)) {
            return cb(
                new Error(
                    `❌ Invalid file type. Allowed: ${acceptedTypes.join(", ")}`
                )
            );
        }
        if (minSize && file.size < minSize) {
            return cb(
                new Error(
                    `❌ File too small. Minimum size: ${minSize / 1024} KB`
                )
            );
        }
        if (maxSize && file.size > maxSize) {
            return cb(
                new Error(
                    `❌ File too large. Maximum size: ${maxSize / 1024} KB`
                )
            );
        }
        cb(null, true);
    };
};

// Cloudinary Upload Function (Streams Directly)
const uploadToCloudinary = (buffer: Buffer, folder: string) => {
    return new Promise((resolve, reject) => {
        const uniqueFilename = `${uuidv4()}${Date.now()}`;
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: uniqueFilename,
                resource_type: "auto",
                chunk_size: 6000000, // Enable chunked upload for large files
                transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// Dynamic Middleware for Secure File Uploads
export const uploadDynamicFiles = (options: UploadOptions) => {
    const upload = multer({
        storage,
        fileFilter: fileFilter(
            options.acceptedTypes,
            options.minSize,
            options.maxSize
        ),
        limits: { fileSize: options.maxSize },
    });

    return async (req: Request, res: Response, next: NextFunction) => {
        upload.fields(options.fields)(req, res, async (err) => {
            if (err) return res.status(400).json({ error: err.message });

            if (!req.files) {
                req.body.fileUrls = [];
                return next();
            }

            try {
                const fileUrls: Record<string, string | string[]> = {};

                for (const field of options.fields) {
                    const uploadedFiles = (
                        req.files as Record<string, Express.Multer.File[]>
                    )[field.name];

                    if (uploadedFiles) {
                        const uploadPromises = uploadedFiles.map((file) =>
                            uploadToCloudinary(
                                file.buffer,
                                options.folder || "union_bank"
                            )
                        );

                        const results = await Promise.all(uploadPromises);
                        fileUrls[field.name] =
                            results.length > 1
                                ? results.map(
                                      (result: any) => result.secure_url
                                  )
                                : (results[0] as any).secure_url;
                    }
                }

                req.body.fileUrls = fileUrls;
                next();
            } catch (error) {
                console.error("Cloudinary Upload Error:", error);
                return res.status(500).json({ error: "File upload failed" });
            }
        });
    };
};
