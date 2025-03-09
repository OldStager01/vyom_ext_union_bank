import { z } from "zod";
import { UserSchema, UserSchemaForCreation } from "../../schemas/user.schema";

export type UserType = z.infer<typeof UserSchema>;
export type UserSchemaForCreationType = z.infer<typeof UserSchemaForCreation>;
