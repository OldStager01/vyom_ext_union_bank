import { query } from "../../../config/db";
import { UnauthorizedError } from "../../../utils/errors";
import { getUser } from "../getUser.service";
import { UserCreditBureauCompleteType } from "../../../types/tables/credit_bureau.type";

export const getCombinedData = async (userId: string) => {
    // Get the user details
    const users = await getUser(userId);
    if (!users || users.length === 0) {
        throw new UnauthorizedError("User not found");
    }
    const user = users[0]!; // Type assertion with ! to indicate non-null

    // Get the credit bureau details
    const creditBureauDetails = await query<UserCreditBureauCompleteType>(
        `SELECT * FROM user_credit_bureau_complete
        WHERE user_id=$1`,
        [userId]
    );
    const userCreditBureauData = creditBureauDetails[0];
    const personalDetails = {
        gender: user.gender,
        dob: user.dob,
        name: user.name,
        occupation: user.occupation,
        annual_income: user.annual_income,
        marital_status: user.marital_status,
    };

    const financialDetails = {
        cibil_score: userCreditBureauData.cibil_score,
        credit_accounts: userCreditBureauData.credit_accounts,
        credit_enquiries: userCreditBureauData.credit_enquiries,
    };

    return {
        personalDetails,
        financialDetails,
    };
};
