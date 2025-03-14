import {
    createRecord,
    getRecords,
    updateRecord,
} from "../../../../db/models/records";
import {
    AccountType,
    BankAccountType,
} from "../../../../types/tables/account.type";
import { tables } from "../../../../db/tables";
import crypto from "crypto";
import { AccountProductType } from "../../../../types/tables/account_product.type";
import { ValidationError } from "../../../../utils/errors";
import { UserAddressType } from "../../../../types/tables/user_addresses.type";
import { query } from "../../../../config/db";
import { UserType } from "../../../../types/tables/user.type";
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

        // Get the user's pincode
        const user_addresses = await getRecords<UserAddressType>(
            tables.userAddresses,
            {
                where: [
                    {
                        column: "user_id",
                        operator: "=",
                        value: id,
                    },
                ],
            }
        );

        const user_address = user_addresses[0];
        if (!user_address) {
            throw new ValidationError("User address not found");
        }

        // Get the nearest branch
        const queryStr = `
            SELECT id, branch_code, branch_name, address, city, state, pin_code, latitude, longitude
            FROM branches
            ORDER BY location <-> ST_MakePoint($1, $2)::GEOGRAPHY
            LIMIT 1;
        `;
        const branch = await query(queryStr, [
            user_address.longitude,
            user_address.latitude,
        ]);
        const branch_id = branch[0].id;

        if (!branch_id) {
            throw new ValidationError("Branch not found");
        }

        await createRecord<AccountType>(tables.accounts, {
            account_number,
            user_id: id,
            product_id,
            branch_id,
            balance: initial_balance,
            account_type: account_product.account_type as BankAccountType,
            status: "active",
        });

        // Update the user
        await updateRecord<UserType>(
            tables.users,
            { registration_status: "completed", branch_id },
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
