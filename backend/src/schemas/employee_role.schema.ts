import { z } from "zod";

export const EmployeeRoleSchema = z.object({
    employee_id: z.string().uuid(),
    role_id: z.number().int().positive(),
});
