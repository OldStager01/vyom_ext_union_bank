import {
    userCreditAccountSchema,
    userCreditBureauCompleteSchema,
    userCreditBureauSchema,
    userCreditEnquirySchema,
} from "../../schemas/credit_bureau.schema";
import { z } from "zod";

// TypeScript types inferred from schemas
export type UserCreditBureauType = z.infer<typeof userCreditBureauSchema>;
export type UserCreditAccountType = z.infer<typeof userCreditAccountSchema>;
export type UserCreditEnquiryType = z.infer<typeof userCreditEnquirySchema>;
export type UserCreditBureauCompleteType = z.infer<
    typeof userCreditBureauCompleteSchema
>;
