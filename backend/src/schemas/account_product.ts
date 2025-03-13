import { z } from "zod";

const AccountProductSchema = z.object({
    id: z.string().uuid().optional(),
    product_name: z
        .string()
        .min(1, "Product name is required")
        .refine((value) => ["DUSBG", "DUSBP"].includes(value), {
            message: "Product name must be one of the following: DUSBG, DUSBP",
        }),
    account_type: z
        .string()
        .min(1, "Account type is required")
        .refine(
            (value) => ["savings", "current", "fixed_deposit"].includes(value),
            {
                message:
                    "Account type must be one of the following: savings, current, fixed_deposit",
            }
        ),
    min_balance: z
        .number()
        .positive()
        .min(1, "Minimum balance must be greater than 0"),
    min_funding: z
        .number()
        .positive()
        .min(1, "Minimum funding must be greater than 0"),
    debit_card_type: z
        .string()
        .min(1, "Debit card type is required")
        .refine((value) => ["Classic", "Platinum"].includes(value), {
            message:
                "Debit card type must be one of the following: Classic, Platinum",
        }),
    free_transactions: z
        .number()
        .positive()
        .min(1, "Free transactions must be greater than 0"),
    daily_withdrawal_limit: z
        .number()
        .positive()
        .min(1, "Daily withdrawal limit must be greater than 0"),
    cheque_leaves: z
        .number()
        .positive()
        .min(1, "Cheque leaves must be greater than 0"),
    sms_banking_charges: z.boolean().default(true),
    demand_draft_discount: z
        .number()
        .min(0, "Demand draft discount must be greater than or equal to 0")
        .max(100, "Demand draft discount must be less than or equal to 100")
        .default(0.0),
    closure_fee_applicable: z.boolean().default(true),
    created_at: z
        .date()
        .default(() => new Date())
        .optional(),
});

export { AccountProductSchema };
