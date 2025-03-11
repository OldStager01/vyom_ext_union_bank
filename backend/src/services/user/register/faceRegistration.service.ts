import { getRecords, updateRecord } from "../../../db/models/records";
import { tables } from "../../../db/tables";
import { UserType } from "../../../types/tables/user.type";
import { ValidationError } from "../../../utils/errors";
import { getUser } from "../getUser.service";

const EMBEDDING_LENGTH = 128;

export async function registerFace(id: string, facial_embedding: string) {
    try {
        if (!facial_embedding || !Array.isArray(facial_embedding)) {
            throw new ValidationError("Facial Embedding should be an Array");
        }
        if (facial_embedding.length !== EMBEDDING_LENGTH) {
            throw new ValidationError(
                "Facial Embedding should be of length 128"
            );
        }

        // Verify User
        const user = await getUser(id);
        if (user.length === 0) {
            throw new ValidationError("User not found");
        }
        if (user[0]?.registration_status !== "face") {
            throw new ValidationError("Choose a valid method");
        }

        // Update User
        await updateRecord<UserType>(
            tables.users,
            { facial_embedding, registration_status: "document" },
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: id,
                    },
                ],
            }
        );
    } catch (error) {
        throw error;
    }
}
