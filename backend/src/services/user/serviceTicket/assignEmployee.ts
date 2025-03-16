import { query } from "../../../config/db";
import { tables } from "../../../db/tables";

export const assignEmployee = async (
    department: string,
    service_type: string,
    branch_id: string,
    language: string,
    isBranch: Boolean
) => {
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
                    AND $2 = ANY(e.roles) -- Match role (service_type)
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
        console.log("No employee found in branch, assigning to central office");
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

    return employee_id;
};
