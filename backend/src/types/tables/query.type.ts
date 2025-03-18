import { querySchema } from "../../schemas/query.schema";
import { z } from "zod";

export type QuerySchemaType = z.infer<typeof querySchema>;
