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
    } catch (error) {
        throw error;
    }
}
