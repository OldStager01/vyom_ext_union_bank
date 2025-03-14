import { z } from "zod";

export const BranchSchema = z.object({
    id: z.string().uuid().optional(),
    branch_code: z
        .string()
        .regex(/^[A-Za-z0-9]{3,10}$/)
        .min(3, "Branch code must be at least 3 characters long")
        .max(10, "Branch code must be at most 10 characters long"),
    branch_name: z
        .string()
        .min(1)
        .max(100, "Branch name must be at most 100 characters long"),
    address: z.string().min(1, "Address is required"),
    city: z
        .string()
        .min(1)
        .max(100, "City must be at most 100 characters long"),
    state: z
        .string()
        .min(1)
        .max(100, "State must be at most 100 characters long"),
    pin_code: z
        .string()
        .regex(/^[0-9]{4,10}$/)
        .min(4, "PIN code must be at least 4 digits long")
        .max(10, "PIN code must be at most 10 digits long"),
    latitude: z
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90"),
    longitude: z
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),

    phone: z
        .string()
        .regex(/^[0-9]{10,15}$/)
        .min(10, "Phone number must be at least 10 digits long")
        .max(15, "Phone number must be at most 15 digits long"),
    manager_id: z.string().uuid().optional(),
    created_at: z
        .date()
        .default(() => new Date())
        .optional(),
    updated_at: z
        .date()
        .default(() => new Date())
        .optional(),
});
