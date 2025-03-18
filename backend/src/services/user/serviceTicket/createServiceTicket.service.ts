import {
    createRecord,
    getRecords,
    updateRecord,
} from "../../../db/models/records";
import { tables } from "../../../db/tables";
import { ServiceTicketType } from "../../../types/tables/service_ticket.type";
import { ValidationError } from "../../../utils/errors";
import { QuerySchemaType } from "../../../types/tables/query.type";
import { assignEmployee } from "./assignEmployee.service";
import { RoleType } from "../../../types/tables/role.type";
import { EmployeeType } from "../../../types/tables/employee.type";

type QueryType = "text" | "video" | "predefined";

export async function createServiceTicketService(
    query_id: string,
    department: string,
    service_type: string,
    request_category: string,
    priority: string,
    query_type: QueryType,
    appointment_type: string,
    role: string,
    transcribed_text: string,
    translated_text: string,
    language: string,
    user_id: string
) {
    try {
        //* 1. Check if the query exists
        const queries = await getRecords<QuerySchemaType>(tables.queries, {
            where: [
                {
                    column: "id",
                    operator: "=",
                    value: query_id,
                },
            ],
        });
        if (!queries || queries.length === 0) {
            throw new ValidationError("Query not found");
        }
        const query = queries[0];
        // const user_id = query?.user_id;
        const branch_id = query?.branch_id;

        //* Get Role ID
        const role_ids = await getRecords<RoleType>(tables.roles, {
            where: [
                {
                    column: "role_name",
                    operator: "=",
                    value: role,
                },
            ],
        });
        console.log("role");
        console.log(role_ids);
        if (!role_ids || role_ids.length === 0) {
            throw new ValidationError("Role not found");
        }
        const role_id = role_ids[0]?.role_id;
        if (!role_id) {
            throw new ValidationError("Role ID not found");
        }

        //* 2. Update the query status to "completed" and add the transcribed and translated text
        await updateRecord<QuerySchemaType>(
            tables.queries,
            {
                id: query_id,
                status: "completed",
                transcribed_text,
                translated_text,
            },
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: query_id,
                    },
                ],
            }
        );

        //* 3. Create a new service ticket
        const service_ticket = await createRecord<Partial<ServiceTicketType>>(
            tables.serviceTickets,
            {
                query_id,
                department: department as "loan" | "operations",
                service_type,
                request_category,
                ticket_priority: priority as
                    | "low"
                    | "medium"
                    | "high"
                    | "critical",
            }
        );
        console.log(service_ticket);

        //* 4. Assign an employee to the service ticket
        const employee_id = await assignEmployee(
            department as string,
            service_type as string,
            branch_id as string,
            language as string,
            role_id as number,
            user_id as string
        );
        if (!employee_id) {
            // TODO: Add to queue
            return;
        }

        const employees = await getRecords<EmployeeType>(tables.employees, {
            where: [
                {
                    column: "id",
                    operator: "=",
                    value: employee_id,
                },
            ],
        });

        const employee = employees[0];
        if (!employee) {
            throw new ValidationError("Employee not found");
        }

        const updatedServiceTicket: Partial<ServiceTicketType> = {
            assigned_to: employee_id,
            assigned_branch: employee.branch_id,
            assigned_role_id: role_id,
        };
        if (appointment_type) {
            updatedServiceTicket.appointment_type = appointment_type as
                | "chat"
                | "audio"
                | "video"
                | "email"
                | "sms";
        }
        await updateRecord<ServiceTicketType>(
            tables.serviceTickets,
            updatedServiceTicket,
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: service_ticket[0].id,
                    },
                ],
            }
        );
    } catch (error) {
        throw error;
    }
}
