import { z } from "zod";

export const ServiceTicketSchema = z.object({
    id: z.string().uuid().optional(),
    query_id: z.string().uuid(),
    // Assigned To fields
    assigned_to: z.string().uuid().optional(),
    assigned_branch: z.string().uuid().optional(),
    assigned_role_id: z.number().optional(),
    // Ticket Details
    department: z.enum(["loan", "operations"]),
    service_type: z.string(),
    request_category: z.string(),
    routing_destination: z.enum(["branch", "central_office"]).default("branch"),
    ticket_priority: z
        .enum(["low", "medium", "high", "critical"])
        .default("medium"),
    ticket_status: z
        .enum(["open", "in_progress", "resolved", "escalated"])
        .default("open"),
    appointment_type: z
        .enum(["chat", "audio", "video", "email", "sms"])
        .nullable()
        .optional(),
    escalation_level: z.number().min(1).max(4).default(1),
    resolved_by: z.string().uuid().optional(),
    resolution_notes: z.string().optional(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});
