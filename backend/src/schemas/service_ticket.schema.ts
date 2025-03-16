import { z } from "zod";

export const ServiceTicketSchema = z.object({
    id: z.string().uuid().optional(),
    query_id: z.string().uuid(),
    priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
    branch_id: z.string().uuid().optional(),
    // Classification fields
    department: z.enum(["loan", "operations"]),
    service_type: z.string(),
    request_category: z.string(),
    // Forwarding field
    routing_destination: z.enum(["branch", "central_office"]).default("branch"),
    assigned_to: z.string().uuid().optional(),
    status: z
        .enum([
            "new",
            "open",
            "in-progress",
            "pending",
            "resolved",
            "closed",
            "cancelled",
        ])
        .default("new"),
    sla_due_time: z.date().nullable(),
    resolution_notes: z.string().nullable(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});
