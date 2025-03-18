import { getRecords } from "../../../db/models/records";
import { tables } from "../../../db/tables";
import { ServiceTicketWithUserType } from "../../../types/tables/service_ticket_with_user.type";
import { WhereCondition } from "../../../types/dbServices.type";

export async function getServiceTicketsWithUserDetails(filters?: {
    user_id?: string;
    ticket_status?: string;
    department?: string;
    service_type?: string;
    ticket_priority?: string;
    start_date?: Date;
    end_date?: Date;
    employee_id?: string;
    employee_name?: string;
    employee_email?: string;
}) {
    const whereConditions: WhereCondition[] = [];

    if (filters?.user_id) {
        whereConditions.push({
            column: "user_id",
            operator: "=",
            value: filters.user_id,
        });
    }

    if (filters?.ticket_status) {
        whereConditions.push({
            column: "ticket_status",
            operator: "=",
            value: filters.ticket_status,
        });
    }

    if (filters?.department) {
        whereConditions.push({
            column: "department",
            operator: "=",
            value: filters.department,
        });
    }

    if (filters?.service_type) {
        whereConditions.push({
            column: "service_type",
            operator: "=",
            value: filters.service_type,
        });
    }

    if (filters?.ticket_priority) {
        whereConditions.push({
            column: "ticket_priority",
            operator: "=",
            value: filters.ticket_priority,
        });
    }

    if (filters?.start_date) {
        whereConditions.push({
            column: "ticket_created_at",
            operator: ">=",
            value: filters.start_date,
        });
    }

    if (filters?.end_date) {
        whereConditions.push({
            column: "ticket_created_at",
            operator: "<=",
            value: filters.end_date,
        });
    }

    if (filters?.employee_id) {
        whereConditions.push({
            column: "employee_id",
            operator: "=",
            value: filters.employee_id,
        });
    }

    if (filters?.employee_name) {
        whereConditions.push({
            column: "employee_name",
            operator: "ILIKE",
            value: `%${filters.employee_name}%`,
        });
    }

    if (filters?.employee_email) {
        whereConditions.push({
            column: "employee_email",
            operator: "ILIKE",
            value: `%${filters.employee_email}%`,
        });
    }

    const tickets = await getRecords<ServiceTicketWithUserType>(
        "service_tickets_with_user_details",
        {
            where: whereConditions,
            orderBy: [
                {
                    column: "ticket_created_at",
                    direction: "DESC",
                },
            ],
        }
    );

    return tickets;
}
