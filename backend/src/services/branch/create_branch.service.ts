import { createRecord } from "../../db/models/records";
import { tables } from "../../db/tables";
import { BranchSchema } from "../../schemas/branch.schema";
import { ValidationError } from "../../utils/errors";

export async function createBranch(
    branch_code: string,
    branch_name: string,
    address: string,
    phone: string
) {
    try {
        const result = BranchSchema.safeParse({
            branch_code,
            branch_name,
            address,
            phone,
        });
        if (!result.success) {
            throw new ValidationError("Invalid Data");
        }

        await createRecord(tables.branches, result.data);
    } catch (error) {
        throw error;
    }
}
