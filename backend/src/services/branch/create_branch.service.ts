import {
    commitTransaction,
    rollbackTransaction,
    startTransaction,
} from "../../config/db";
import { createRecord } from "../../db/models/records";
import { tables } from "../../db/tables";
import { BranchSchema } from "../../schemas/branch.schema";
import { ValidationError } from "../../utils/errors";
import { getLatLongByPincode } from "../../utils/getLatLongByPincode";

export async function createBranch(
    branch_code: string,
    branch_name: string,
    address: string,
    city: string,
    state: string,
    pin_code: string,
    phone: string
) {
    const client = await startTransaction();
    try {
        const { latitude, longitude } = await getLatLongByPincode(pin_code);

        const result = BranchSchema.safeParse({
            branch_code,
            branch_name,
            address,
            city,
            state,
            pin_code,
            latitude,
            longitude,
            phone,
        });
        if (!result.success) {
            console.error(result.error);
            throw new ValidationError("Invalid Data");
        }

        await createRecord(tables.branches, result.data);
        await commitTransaction(client);
    } catch (error) {
        await rollbackTransaction(client);
        throw error;
    }
}
