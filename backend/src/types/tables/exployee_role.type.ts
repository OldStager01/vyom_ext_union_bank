import { EmployeeRoleSchema } from "../../schemas/employee_role.schema";
import { z } from "zod";

export type EmployeeRoleType = z.infer<typeof EmployeeRoleSchema>;
