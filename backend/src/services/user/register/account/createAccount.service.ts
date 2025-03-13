import { createRecord, getRecords } from "../../../../db/models/records";
import { AccountType } from "../../../../types/tables/account.type";
import { tables } from "../../../../db/tables";
import crypto from "crypto";
import { AccountProductType } from "../../../../types/tables/account_product.type";
import { ValidationError } from "../../../../utils/errors";
export async function createAccount(
    id: string,
    product_id: string,
    initial_balance: number
) {
    try {
        if (!id || !product_id) {
            throw new ValidationError("id and product_id are required");
        }

        const accountProducts = await getRecords<AccountProductType>(
            tables.account_products,
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: product_id,
                    },
                ],
            }
        );
        if (accountProducts.length === 0) {
            throw new ValidationError("Account product not found");
        }

        const account_product = accountProducts[0];
        if (!account_product) {
            throw new ValidationError("Account product not found");
        }

        const account_number = (crypto
            .randomBytes(20)
            .toString("hex")
            .slice(0, 20),
        16)
            .toString()
            .padStart(20, "0");

        await createRecord<AccountType>(tables.accounts, {
            account_number,
            user_id: id,
            product_id,
            balance: initial_balance,
            account_type:
                account_product.account_type as AccountType["account_type"],
            status: "active",
        });
    } catch (error) {
        throw error;
    }
}
