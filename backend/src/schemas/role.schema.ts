import { z } from "zod";

export const RoleSchema = z.object({
    role_id: z.number(),
    role_name: z.string().min(1).max(100),
    role_level: z.number().int().min(1).max(4),
    department: z.enum(["loans", "operations"]),
    branch_level: z.boolean().default(false),
});
