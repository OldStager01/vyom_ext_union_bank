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
    roles: number[], // role_id
    spoken_languages: string[]
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
            spoken_languages,
        });
        if (!employee.success) {
            console.error(employee.error);
            throw new ValidationError();
        }

        //* 1. Create employee
        const employee_record = await createRecord(
            tables.employees,
            employee.data
        );

        //* 2. Create employee roles
        const employee_roles_promise = roles.map(async (role_id) => {
            await createRecord(tables.employee_roles, {
                employee_id: employee_record[0].id,
                role_id,
            });
        });
        await Promise.all(employee_roles_promise);
    } catch (error) {
        throw error;
    }
}
