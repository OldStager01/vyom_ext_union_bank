import { z } from "zod";
import { AccountProductSchema } from "../../schemas/account_product";

export type AccountProductType = z.infer<typeof AccountProductSchema>;
