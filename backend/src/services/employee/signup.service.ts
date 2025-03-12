import { ValidationError } from "zod-validation-error";
import { EmployeeSchema } from "../../schemas/employee.schema";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { createRecord } from "../../db/models/records";
import { tables } from "../../db/tables";

export async function signUpEmployee(
    branch_id: string,
    name: string,
    email: string,
    phone: string,
    pass: string,
    role: string
) {
    try {
        const employee_number = crypto
            .randomInt(100000, 999999999999)
            .toString();

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(pass, salt);
        const employee = await EmployeeSchema.safeParseAsync({
            employee_number,
            branch_id,
            name,
            email,
            phone,
            password,
            role,
        });
        if (!employee.success) {
            console.error(employee.error);
            throw new ValidationError();
        }

        await createRecord(tables.employees, employee.data);
    } catch (error) {
        throw error;
    }
}
