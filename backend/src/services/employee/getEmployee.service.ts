import { getRecords } from "../../db/models/records";
import { tables } from "../../db/tables";
import { EmployeeType } from "../../types/tables/employee.type";
import { ValidationError } from "../../utils/errors";

export async function getEmployee(id: string) {
    try {
        if (!id) throw new ValidationError("Employee Id is required");

        const employee = await getRecords<EmployeeType>(tables.employees, {
            where: [
                {
                    column: "id",
                    operator: "=",
                    value: id,
                },
            ],
        });
        return employee;
    } catch (error) {
        throw error;
    }
}
