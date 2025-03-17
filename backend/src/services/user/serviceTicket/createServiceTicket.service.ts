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
import { assignEmployee } from "./assignEmployee";

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

        //* 3. Assign an employee to the service ticket
        const employee_id = await assignEmployee(
            department as string,
            service_type as string,
            branch_id as string,
            language as string,
            isBranch
        );

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
