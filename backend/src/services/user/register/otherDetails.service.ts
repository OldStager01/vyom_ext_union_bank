import { getRecords, updateRecord } from "../../../db/models/records";
import { tables } from "../../../db/tables";
import { UserSchema } from "../../../schemas/user.schema";
import { MaritalStatusType, UserType } from "../../../types/tables/user.type";
import { ConflictError, ValidationError } from "../../../utils/errors";

export async function addOtherDetails(
    id: string,
    occupation: string,
    annual_income: number,
    marital_status: string
) {
    try {
        const result = UserSchema.partial().safeParse({
            id,
            occupation,
            annual_income,
            marital_status,
        });
        if (!result.success) {
            throw new ValidationError(result.error.message);
        }

        // Check if user exists
        const user = await getRecords<UserType>(tables.users, {
            where: [
                {
                    column: "id",
                    operator: "=",
                    value: id,
                },
            ],
        });

        if (user.length === 0) {
            throw new ValidationError("User not found");
        }
        console.log(user);

        if (user[0]?.registration_status !== "other") {
            throw new ConflictError("Choose a valid method");
        }

        // Update other details

        const updateData: Partial<UserType> = {
            occupation,
            annual_income,
            marital_status: marital_status as MaritalStatusType,
            registration_status: "face",
        };

        await updateRecord(tables.users, updateData, {
            where: [
                {
                    column: "id",
                    operator: "=",
                    value: id,
                },
            ],
        });

        return;
    } catch (error) {
        throw error;
    }
}
