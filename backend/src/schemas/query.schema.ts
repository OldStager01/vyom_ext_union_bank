import { z } from "zod";

export const querySchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid(),
    branch_id: z.string().uuid().optional(),
    query_type: z.enum(["text", "predefined", "video"]).optional(),
    query_text: z.string().optional(),
    predefined_query: z.string().optional(),
    video_url: z.string().optional(),
    transcript: z.string().optional(),
    category: z.string().optional(),
    sub_category: z.string().optional(),
    created_at: z.date().optional(),
});
