import {
    createRecord,
    getRecords,
    updateRecord,
} from "../../../db/models/records";
import { tables } from "../../../db/tables";
import { ServiceTicketType } from "../../../types/tables/service_ticket.type";
import { ValidationError } from "../../../utils/errors";
import { QuerySchemaType } from "../../../types/tables/query.type";
import { query } from "../../../config/db";

type QueryType = "text" | "video" | "predefined";

export async function createServiceTicketService({
    query_id,
    priority,
    query_type,
    routing_destination,
    department,
    service_type,
    request_category,
    translated_text,
    transcribed_text,
    language,
}: Partial<ServiceTicketType> & {
    transcribed_text?: string;
    translated_text?: string;
    language?: string;
    query_type: QueryType;
}) {
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
        const user_id = queries[0]?.user_id;
        const branch_id = queries[0]?.branch_id;
        const isBranch = routing_destination === "branch";

        //* 2. Update the query status to "completed" and add the transcribed and translated text
        const updatedQuery = await updateRecord<QuerySchemaType>(
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

        //* 3. Find the right employee to assign the ticket to
        const employeeQuery = `
            WITH employee_priority_ranking AS (
                SELECT 
                    e.id AS employee_id, 
                    COUNT(st.id) FILTER (WHERE st.priority = 'high') AS high_priority_count,
                    COUNT(st.id) AS total_ticket_count
                FROM employees e
                LEFT JOIN service_tickets st 
                    ON e.id = st.assigned_to 
                    AND st.status IN ('open', 'in-progress')
                WHERE e.status = 'active'
                    AND e.department = $1 -- Match department
                    AND $2 = ANY(e.roles) -- Match role (sub_category)
                    ${isBranch && branch_id ? `AND e.branch_id = $3` : ""}
                    ${language ? `AND $4 = ANY(e.spoken_languages)` : ""}
                GROUP BY e.id
                HAVING COALESCE(COUNT(st.id), 0) < 5
            )
            SELECT employee_id
            FROM employee_priority_ranking
            ORDER BY high_priority_count ASC, total_ticket_count ASC, RANDOM() -- Prefer employees with fewer high-priority tickets
            LIMIT 1;
        `;
        let employee_id = null;
        const employeeResult = await query(employeeQuery, [
            department,
            service_type,
            branch_id,
            language,
        ]);
        //* If an employee is found in the branch, assign to them
        if (employeeResult && employeeResult.length > 0) {
            employee_id = employeeResult[0]?.employee_id;
        }

        //* If no employee is found, assign to the central office
        if (employee_id == null) {
            console.log(
                "No employee found in branch, assigning to central office"
            );
            const centralOfficeQuery = `
                SELECT e.id AS employee_id
                FROM ${tables.employees} e
                LEFT JOIN service_tickets st 
                    ON e.id = st.assigned_to AND st.status IN ('open', 'in-progress')
                WHERE e.status = 'active'
                    AND e.department = $1 -- Match department
                    AND $2 = ANY(e.roles) -- Match role (service_type)
                    ${language ? `AND $3 = ANY(e.spoken_languages)` : ""}
                GROUP BY e.id
                HAVING COALESCE(COUNT(st.id), 0) < 5 -- Handle case where no tickets exist
                ORDER BY COUNT(st.id) ASC, RANDOM() -- Assign to least busy employee randomly if tie
                LIMIT 1;
        `;
            const centralOfficeResult = await query(centralOfficeQuery, [
                department,
                "central",
                language,
            ]);
            employee_id = centralOfficeResult[0]?.employee_id;
        }

        //* If no employee is found, throw an error
        if (employee_id == null) {
            throw new ValidationError("No employee found");
        }

        console.log(employee_id);

        //* 4. Create the service ticket
    } catch (error) {
        throw error;
    }
}
