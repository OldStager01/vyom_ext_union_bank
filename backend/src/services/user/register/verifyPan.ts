import { updateUser } from "../../../db/models/users";
import { PanVerificationType } from "../../../types/panVerification.type";
import { UserType } from "../../../types/tables/user.type";

export async function verifyPan(
    id: string,
    pan_number: string,
    name: string,
    dob: string
) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    let isValid = true;
    if (!panRegex.test(pan_number)) {
        isValid = false;
    }
    const date = new Date(dob);
    if (isNaN(date.getTime()) || new Date() < date) {
        isValid = false;
    }

    const nameRegex = /^[a-zA-Z ]+$/;
    if (!nameRegex.test(name)) {
        isValid = false;
    }
    const panDetails: PanVerificationType = await getPanDetails(pan_number);
    if (!panDetails || panDetails.status !== "VALID") {
        isValid = false;
    }
    if (
        name.toLowerCase() !== panDetails.name.toLowerCase() ||
        date.toDateString() !== new Date(panDetails.dob).toDateString()
    ) {
        isValid = false;
    }
    if (!isValid) {
        throw new Error("Invalid pan details");
    }

    await updateUser<UserType>(
        {
            pan_number,
            name,
            dob: new Date(dob),
            registration_status: "pending_aadhaar_verification",
        },
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
}

const getPanDetails = async (
    pan_number: string
): Promise<PanVerificationType> => {
    return new Promise((resolve) => {
        return resolve({
            verification_id: "test001",
            reference_id: 21637861,
            pan: "ABCDY1234D",
            name: "John Doe",
            dob: "1993-06-30",
            name_match: "Y",
            dob_match: "Y",
            pan_status: "E",
            status: "VALID",
            aadhaar_seeding_status: "Y",
            aadhaar_seeding_status_desc: "Aadhaar is linked to PAN",
        });
    });
};
