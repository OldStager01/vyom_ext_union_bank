import { createRecord } from "../../db/models/records";
import { tables } from "../../db/tables";
import { AccountProductSchema } from "../../schemas/account_product";
import { ValidationError } from "../../utils/errors";

export async function createAccountProduct(
    product_name: string,
    account_type: string,
    min_balance: number,
    min_funding: number,
    debit_card_type: string,
    free_transactions: number,
    daily_withdrawal_limit: number,
    cheque_leaves: number,
    sms_banking_charges: boolean,
    demand_draft_discount: number,
    closure_fee_applicable: boolean
) {
    try {
        const result = AccountProductSchema.safeParse({
            product_name,
            account_type,
            min_balance,
            min_funding,
            debit_card_type,
            free_transactions,
            daily_withdrawal_limit,
            cheque_leaves,
            sms_banking_charges,
            demand_draft_discount,
            closure_fee_applicable,
        });
        if (!result.success) {
            throw new ValidationError(result.error.message);
        }
        const accountProduct = result.data;
        return await createRecord(tables.account_products, accountProduct);
    } catch (error) {
        throw error;
    }
}
