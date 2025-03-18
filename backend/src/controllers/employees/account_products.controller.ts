import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/authRequest.type";
import { AccountProductType } from "../../types/tables/account_product.type";
import { createAccountProduct } from "../../services/employee/createAccountProduct.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { getRecords } from "../../db/models/records";
import { tables } from "../../db/tables";
import { NotFoundError } from "../../utils/errors";

export const createAccountProductsController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
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
        }: AccountProductType = req.body;

        await createAccountProduct(
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
            closure_fee_applicable
        );

        ApiResponse.send(res, 200, "Account Product Created");
    } catch (error) {
        next(error);
    }
};

export const getAccountProductsController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const accountProducts = await getRecords<AccountProductType>(
            tables.account_products,
            {}
        );
        if (!accountProducts || accountProducts.length === 0)
            throw new NotFoundError("No account products found");
        ApiResponse.send(res, 200, "Account Products", { accountProducts });
    } catch (error) {
        next(error);
    }
};
