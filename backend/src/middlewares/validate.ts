import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";
import { fromError } from "zod-validation-error";
export default function validate(
    schema: ZodSchema<any>,
    optional: Boolean = false
) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (optional) {
                req.body = schema.optional().parse(req.body);
            } else {
                req.body = schema.parse(req.body);
            }
            next();
        } catch (error) {
            const e = fromError(error);
            throw new ApiError(400, e.message, [], e.stack);
        }
    };
}
