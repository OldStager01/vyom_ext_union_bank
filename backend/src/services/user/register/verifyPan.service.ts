import env from "../../../config/env";
import {
    createRecord,
    getRecords,
    updateRecord,
} from "../../../db/models/records";
import { tables } from "../../../db/tables";
import { PanVerificationType } from "../../../types/panVerification.type";
import {
    UserCreditAccountType,
    UserCreditBureauType,
} from "../../../types/tables/credit_bureau.type";
import { UserType } from "../../../types/tables/user.type";
import { ValidationError, ConflictError } from "../../../utils/errors";

export async function verifyPan(
    id: string,
    pan_number: string,
    name: string,
    dob: string
) {
    try {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(pan_number))
            throw new ValidationError("Invalid PAN");
        const date = new Date(dob);
        if (isNaN(date.getTime()) || new Date() < date)
            throw new ValidationError("Invalid date of birth");

        const nameRegex = /^[a-zA-Z ]+$/;
        if (!nameRegex.test(name)) throw new ValidationError("Invalid name");

        // TODO: Call PAN verification API
        // const panDetails: PanVerificationType = await getPanDetails(pan_number);
        const panDetails: PanVerificationType = await fetch(
            `${env.CREDIT_BUREAU_API_URL}/pan?pan=${pan_number}`
        ).then((res) => res.json());

        if (!panDetails || panDetails.status !== "VALID") {
            throw new ConflictError(
                "PAN is already registered with another user or invalid"
            );
        }

        if (
            name.toLowerCase() !== panDetails.name.toLowerCase() ||
            date.toDateString() !== new Date(panDetails.dob).toDateString()
        ) {
            throw new ConflictError(
                "Name or date of birth does not match with PAN records"
            );
        }

        // Update the User
        await updateRecord<UserType>(
            tables.users,
            {
                pan_number,
                name,
                dob: new Date(new Date(dob).toDateString()),
                registration_status: "aadhar",
                updated_at: new Date(),
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

        // Get the credit bureau details
        const creditBureauDetails = await fetch(
            `${env.CREDIT_BUREAU_API_URL}/cibil?pan=${pan_number}`
        );
        const creditBureauDetailsData = await creditBureauDetails.json();
        // Update all the tables with    the details in the credit bureau
        // 1. user_credit_bureau_data
        // 2. user_credit_accounts
        // 3. user_credit_enquiries

        // 1. user_credit_bureau_data
        const creditBureauRecords = await createRecord<UserCreditBureauType>(
            tables.userCreditBureauData,
            {
                user_id: id,
                name: creditBureauDetailsData.name,
                dob: new Date(creditBureauDetailsData.dob).toISOString(),
                income_tax_id: creditBureauDetailsData.income_tax_id,
                cibil_score: creditBureauDetailsData.cibil_score,
            }
        );

        const creditBureauRecord = creditBureauRecords[0];
        // 2. user_credit_accounts
        for (const account of creditBureauDetailsData.accounts) {
            await createRecord<UserCreditAccountType>(
                tables.userCreditAccounts,
                {
                    user_credit_bureau_id: creditBureauRecord.id,
                    member_name: account.member_name,
                    account_number: account.account_number,
                    type: account.type,
                }
            );
        }

        // 3. user_credit_enquiries
        for (const enquiry of creditBureauDetailsData.enquiries) {
            await createRecord(tables.userCreditEnquiries, {
                user_credit_bureau_id: creditBureauRecord.id,
                member_name: enquiry.member_name,
                enquiry_date: new Date(enquiry.enquiry_date).toISOString(),
                purpose: enquiry.purpose,
            });
        }
    } catch (error) {
        throw error;
    }
}

const getPanDetails = async (
    pan_number: string
): Promise<PanVerificationType> => {
    return new Promise((resolve) => {
        return resolve({
            verification_id: "test001",
            reference_id: 21637861,
            pan: "ABCCO1234G",
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
