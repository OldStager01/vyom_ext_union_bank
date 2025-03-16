import { z } from "zod";

export const querySchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid(),
    branch_id: z.string().uuid().optional(),
    query_type: z.enum(["text", "predefined", "video"]).default("text"),
    query_text: z.string().optional(),
    predefined_query: z.string().optional(),
    video_url: z.string().optional(),
    transcribed_text: z.string().optional(),
    translated_text: z.string().optional(),
    status: z.enum(["processing", "completed", "failed"]).default("processing"),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});
