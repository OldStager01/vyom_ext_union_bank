import { z } from "zod";

export const ServiceTicketWithUserSchema = z.object({
    // Service Ticket fields
    ticket_id: z.string().uuid(),
    query_id: z.string().uuid(),
    department: z.enum(["loan", "operations"]),
    service_type: z.string(),
    request_category: z.string(),
    routing_destination: z.enum(["branch", "central_office"]),
    ticket_priority: z.enum(["low", "medium", "high", "critical"]),
    ticket_status: z.enum(["open", "in_progress", "resolved", "escalated"]),
    appointment_type: z
        .enum(["chat", "audio", "video", "email", "sms"])
        .nullable(),
    escalation_level: z.number().min(1).max(4),
    resolved_by: z.string().uuid().nullable(),
    resolution_notes: z.string().nullable(),
    ticket_created_at: z.date(),
    ticket_updated_at: z.date(),
    // Query fields
    query_type: z.enum(["text", "predefined", "video"]),
    query_text: z.string().nullable(),
    predefined_query: z.string().nullable(),
    video_url: z.string().nullable(),
    transcribed_text: z.string().nullable(),
    translated_text: z.string().nullable(),
    query_status: z.enum(["processing", "completed", "failed"]),
    // User fields
    user_id: z.string().uuid(),
    user_name: z.string(),
    mobile_number: z.string(),
    email: z.string().nullable(),
    aadhar_number: z.string(),
    pan_number: z.string().nullable(),
    occupation: z.string().nullable(),
    annual_income: z.number().nullable(),
    marital_status: z
        .enum(["Single", "Married", "Divorced", "Widowed"])
        .nullable(),
    kyc_status: z.enum(["pending", "approved", "rejected"]),
    registration_status: z.enum([
        "pan",
        "aadhar",
        "email",
        "face",
        "document",
        "other",
        "vkyc",
        "account",
        "completed",
    ]),
    user_status: z.enum(["active", "inactive"]),
    // Employee fields
    employee_id: z.string().uuid().nullable(),
    employee_name: z.string().nullable(),
    employee_email: z.string().nullable(),
});

export type ServiceTicketWithUserType = z.infer<
    typeof ServiceTicketWithUserSchema
>;
