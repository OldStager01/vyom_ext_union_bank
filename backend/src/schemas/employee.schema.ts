import { z } from "zod";

export const EmployeeSchema = z.object({
    id: z.string().uuid().optional(),
    employee_number: z
        .string()
        .regex(/^[A-Za-z0-9]{3,12}$/)
        .min(3, "Employee number must be at least 3 characters long")
        .max(12, "Employee number must be at most 12 characters long"),
    branch_id: z
        .string()
        .uuid()
        .refine((value) => value !== undefined, {
            message: "Branch ID is required",
        }),
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/)
        .min(10, "Phone number must be at least 10 digits long")
        .max(15, "Phone number must be at most 15 digits long"),
    password: z.string(),
    spoken_languages: z.array(z.string()),
    refresh_token: z.string().nullable().optional(),
    status: z.enum(["active", "inactive", "terminated"]).default("active"),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});
