import { Request, Response, NextFunction } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import { createReadStream, statSync } from "fs";
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

interface CloudinaryResponse {
    secure_url: string;
    [key: string]: any; // Allow other Cloudinary response properties
}

// Configure Local Storage
const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), "uploads");
        // Create uploads directory if it doesn't exist
        fs.mkdir(uploadDir, { recursive: true })
            .then(() => cb(null, uploadDir))
            .catch((err) => cb(err, uploadDir));
    },
    filename: (req, file, cb) => {
        const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    },
});

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

// Enhanced Cloudinary Upload Function with Progress
const uploadToCloudinary = async (
    filepath: string,
    folder: string
): Promise<CloudinaryResponse> => {
    try {
        // Get file size for percentage calculation
        const fileSize = statSync(filepath).size;

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "auto",
                    chunk_size: 6000000,
                    transformation: [{ quality: "auto", fetch_format: "auto" }],
                },
                (error, result) => {
                    if (error) reject(error);
                    else if (result) resolve(result as CloudinaryResponse);
                    else reject(new Error("No result from Cloudinary"));
                }
            );

            let uploadedBytes = 0;
            const fileStream = createReadStream(filepath);

            // Log progress on data chunks
            fileStream.on("data", (chunk) => {
                uploadedBytes += chunk.length;
                const percentage = Math.round((uploadedBytes / fileSize) * 100);
                console.log(
                    `Uploading ${path.basename(filepath)}: ${percentage}%`
                );
            });

            // Log completion
            fileStream.on("end", () => {
                console.log(`Upload completed for ${path.basename(filepath)}`);
            });

            // Handle potential errors
            fileStream.on("error", (error) => {
                console.error(
                    `Error uploading ${path.basename(filepath)}:`,
                    error
                );
                reject(error);
            });

            fileStream.pipe(uploadStream);
        });
    } catch (error) {
        // Cleanup local file on error
        await fs.unlink(filepath);
        throw error;
    }
};

// Enhanced Dynamic Middleware with Progress Tracking
export const uploadDynamicFiles = (options: UploadOptions) => {
    const upload = multer({
        storage: localStorage,
        fileFilter: fileFilter(
            options.acceptedTypes,
            options.minSize,
            options.maxSize
        ),
        limits: { fileSize: options.maxSize },
    });

    return async (req: Request, res: Response, next: NextFunction) => {
        upload.fields(options.fields)(req, res, async (err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ error: err.message });
            }

            if (!req.files) {
                req.body.fileUrls = [];
                return next();
            }

            try {
                const fileUrls: Record<string, string | string[]> = {};
                const totalFiles = Object.values(
                    req.files as Record<string, Express.Multer.File[]>
                ).flat().length;

                console.log(`Starting upload of ${totalFiles} file(s)`);
                let completedFiles = 0;

                for (const field of options.fields) {
                    const uploadedFiles = (
                        req.files as Record<string, Express.Multer.File[]>
                    )[field.name];

                    if (uploadedFiles) {
                        const results = await Promise.all(
                            uploadedFiles.map(async (file) => {
                                const result = await uploadToCloudinary(
                                    file.path,
                                    options.folder || "union_bank"
                                );
                                completedFiles++;
                                console.log(
                                    `Overall progress: ${Math.round((completedFiles / totalFiles) * 100)}% (${completedFiles}/${totalFiles} files)`
                                );
                                return result;
                            })
                        );

                        fileUrls[field.name] =
                            results.length > 1
                                ? results.map(
                                      (result: CloudinaryResponse) =>
                                          result.secure_url
                                  )
                                : results[0].secure_url;
                    }
                }

                console.log("All uploads completed successfully!");
                req.body.fileUrls = fileUrls;
                next();
            } catch (error) {
                console.error("Cloudinary Upload Error:", error);

                // Cleanup: Delete any remaining local files
                if (req.files) {
                    const cleanup = Object.values(
                        req.files as Record<string, Express.Multer.File[]>
                    )
                        .flat()
                        .map((file) => fs.unlink(file.path).catch(() => {}));
                    await Promise.all(cleanup);
                }

                return res.status(500).json({ error: "File upload failed" });
            }
        });
    };
};
