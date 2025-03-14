import { z } from "zod";

// Base schema for credit bureau data
export const userCreditBureauSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid(),
    name: z.string().min(1).max(100),
    dob: z.string().datetime(),
    income_tax_id: z.string().length(10),
    cibil_score: z.number().int().min(300).max(900),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
});

// Schema for credit accounts
export const userCreditAccountSchema = z.object({
    id: z.string().uuid().optional(),
    user_credit_bureau_id: z.string().uuid(),
    member_name: z.string().min(1).max(100),
    account_number: z.string().min(1).max(50),
    type: z.string().min(1).max(50),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
});

// Schema for credit enquiries
export const userCreditEnquirySchema = z.object({
    id: z.string().uuid().optional(),
    user_credit_bureau_id: z.string().uuid(),
    member_name: z.string().min(1).max(100),
    enquiry_date: z.string().datetime(),
    purpose: z.string().min(1).max(50),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
});

// Schema for credit bureau complete
export const userCreditBureauCompleteSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    name: z.string().min(1).max(100),
    dob: z.string().datetime(),
    income_tax_id: z.string().length(10),
    cibil_score: z.number().int().min(300).max(900),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
    credit_accounts: z.array(
        z.object({
            id: z.string().uuid(),
            member_name: z.string().min(1).max(100),
            account_number: z.string().min(1).max(50),
            type: z.string().min(1).max(50),
            created_at: z.string().datetime(),
            updated_at: z.string().datetime(),
        })
    ),
    credit_enquiries: z.array(
        z.object({
            id: z.string().uuid(),
            member_name: z.string().min(1).max(100),
            enquiry_date: z.string().datetime(),
            purpose: z.string().min(1).max(50),
            created_at: z.string().datetime(),
            updated_at: z.string().datetime(),
        })
    ),
});
