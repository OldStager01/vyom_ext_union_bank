import { z } from "zod";

export const EmployeeSchema = z.object({
    id: z.string().uuid().optional(),
    employee_number: z
        .string()
        .regex(/^[A-Za-z0-9]{3,12}$/)
        .min(3, "Employee number must be at least 3 characters long")
        .max(12, "Employee number must be at most 12 characters long"),
    branch_id: z
        .string()
        .uuid()
        .refine((value) => value !== undefined, {
            message: "Branch ID is required",
        }),
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/)
        .min(10, "Phone number must be at least 10 digits long")
        .max(15, "Phone number must be at most 15 digits long"),
    password: z.string(),
    department: z.enum(["operations", "loans"]),
    roles: z.array(
        z.enum([
            // Operations roles
            "account_services",
            "address_changes",
            "contact_details",
            "identity_updates",
            "certificates",
            "name_changes",
            "cash_services",
            "card_services",
            "security",
            "general",
            "cheque_services",
            // Loans roles
            "loans_general",
            "home_loan",
            "vehicle_loan",
            "educational_loan",
            "personal_loan",
            "loan_against_property",
            "senior_citizen_loans",
            "gold_loan",
            "interest_rates",
        ])
    ),
    spoken_languages: z.array(z.string()),
    refresh_token: z.string().nullable().optional(),
    status: z.enum(["active", "inactive", "terminated"]).default("active"),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});
