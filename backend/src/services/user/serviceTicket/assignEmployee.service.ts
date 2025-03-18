import { query } from "../../../config/db";
import { tables } from "../../../db/tables";

export const assignEmployee = async (
    department: string,
    service_type: string,
    branch_id: string,
    language: string,
    role_id: number,
    user_id: string
) => {
    //* 1. Check for an Employee in the Same Branch & Role (Primary Assignment)
    const employeeQuery = `
            WITH employee_priority_ranking AS (
                SELECT 
                    e.id AS employee_id, 
                    COUNT(st.id) FILTER (WHERE st.ticket_priority = 'high') AS high_priority_count,
                    COUNT(st.id) AS total_ticket_count
                FROM employees e
                LEFT JOIN service_tickets st 
                    ON e.id = st.assigned_to 
                    AND st.ticket_status IN ('open', 'in_progress')
                LEFT JOIN employee_roles er ON e.id = er.employee_id
                WHERE e.status = 'active'
                    AND er.role_id = $1 -- Match role (service_type)
                    AND e.branch_id = $2 -- Ensure same branch
                    ${language ? `AND $3 = ANY(e.spoken_languages)` : ""}
                GROUP BY e.id
                HAVING COALESCE(COUNT(st.id), 0) < 5 -- Limit workload to prevent overloading
            )
            SELECT employee_id
            FROM employee_priority_ranking
            ORDER BY high_priority_count ASC, total_ticket_count ASC, RANDOM() -- Prefer employees with fewer high-priority tickets
            LIMIT 1;
            `;
    let employee_id = null;
    const employeeResult = await query(employeeQuery, [
        // department,
        role_id,
        branch_id,
        language,
    ]);
    //* If an employee is found in the branch, assign to them
    if (employeeResult && employeeResult.length > 0) {
        employee_id = employeeResult[0]?.employee_id;
    }
    // ! FALLBACK 1
    //* Fallback 1. Find an Employee in the Same Role (Any Branch)
    if (employee_id == null) {
        console.log(
            "No employee found in branch, finding in same role in any branch"
        );
        const anyBranchQuery = `
                WITH employee_priority_ranking AS (
                    SELECT 
                        e.id AS employee_id, 
                        e.branch_id, 
                        COUNT(st.id) FILTER (WHERE st.ticket_priority = 'high') AS high_priority_count,
                        COUNT(st.id) AS total_ticket_count
                    FROM employees e
                    LEFT JOIN service_tickets st 
                        ON e.id = st.assigned_to 
                        AND st.ticket_status IN ('open', 'in_progress')
                    LEFT JOIN employee_roles er ON e.id = er.employee_id
                    WHERE e.status = 'active'
                        AND er.role_id = $1 -- Match role
                        ${language ? ` AND $2 = ANY(e.spoken_languages)` : ""}
                    GROUP BY e.id, e.branch_id
                    HAVING COALESCE(COUNT(st.id), 0) < 5
                )
                SELECT employee_id, branch_id
                FROM employee_priority_ranking
                ORDER BY high_priority_count ASC, total_ticket_count ASC, RANDOM()
                LIMIT 1;
        `;

        const anyBranchResult = await query(anyBranchQuery, [
            role_id,
            language,
        ]);
        employee_id = anyBranchResult[0]?.employee_id;
    }

    // ! FALLBACK 2
    //* Fallback 2. Assign to a Fallback Role in the Same Tier
    if (employee_id == null) {
        console.log(
            "No employee found in same role, finding in same role in same branch"
        );
        const fallbackRoleQuery = `
        WITH role_info AS (
            -- Get the role tier of the current service ticket
            SELECT role_level 
            FROM roles 
            WHERE role_id = $1
        ),
        fallback_roles AS (
            -- Find fallback roles in the same tier
            SELECT role_id 
            FROM roles 
            WHERE role_level = (SELECT role_level FROM role_info)
        ),
        employee_priority_ranking AS (
            SELECT 
                e.id AS employee_id, 
                e.branch_id,
                r.role_id,
                COUNT(st.id) FILTER (WHERE st.ticket_priority = 'high') AS high_priority_count,
                COUNT(st.id) AS total_ticket_count
            FROM employees e
            JOIN employee_roles er ON e.id = er.employee_id
            JOIN fallback_roles r ON er.role_id = r.role_id
            LEFT JOIN service_tickets st 
                ON e.id = st.assigned_to 
                AND st.ticket_status IN ('open', 'in_progress')
            WHERE e.status = 'active'
                ${branch_id ? `AND e.branch_id = $2` : ""}
                ${language ? `AND $3 = ANY(e.spoken_languages)` : ""}
            GROUP BY e.id, e.branch_id, r.role_id
            HAVING COALESCE(COUNT(st.id), 0) < 5
        )
        SELECT employee_id, branch_id, role_id
            FROM employee_priority_ranking
            ORDER BY high_priority_count ASC, total_ticket_count ASC, RANDOM()
            LIMIT 1;
        `;

        const fallbackRoleResult = await query(fallbackRoleQuery, [
            role_id,
            branch_id,
            language,
        ]);
        employee_id = fallbackRoleResult[0]?.employee_id;
    }
    // ! FALLBACK 3
    //* Fallback 3. Escalate the Ticket
    if (employee_id == null) {
        console.log(
            "No employee found in fallback role, assigning to central office"
        );
        const escalationQuery = `
            WITH role_info AS (
                -- Get the role level of the current service ticket
                SELECT role_level, department
                FROM roles 
                WHERE role_id = $1
            ),
            higher_roles AS (
                -- Find roles in the same department with a higher level
                SELECT role_id 
                FROM roles 
                WHERE role_level > (SELECT role_level FROM role_info)
                AND department = (SELECT department FROM role_info)
                ORDER BY role_level ASC -- Prefer the closest higher role
            ),
            employee_priority_ranking AS (
                SELECT 
                    e.id AS employee_id, 
                    e.branch_id,
                    r.role_id,
                    COUNT(st.id) FILTER (WHERE st.ticket_priority = 'high') AS high_priority_count,
                    COUNT(st.id) AS total_ticket_count
                FROM employees e
                JOIN employee_roles er ON e.id = er.employee_id
                JOIN higher_roles r ON er.role_id = r.role_id
                LEFT JOIN service_tickets st 
                    ON e.id = st.assigned_to 
                    AND st.ticket_status IN ('open', 'in_progress')
                WHERE e.status = 'active'
                    ${branch_id ? `AND e.branch_id = $2` : ""}
                    ${language ? `AND $3 = ANY(e.spoken_languages)` : ""}
                GROUP BY e.id, e.branch_id, r.role_id
                HAVING COALESCE(COUNT(st.id), 0) < 5
            )
            SELECT employee_id, branch_id, role_id
            FROM employee_priority_ranking
            ORDER BY high_priority_count ASC, total_ticket_count ASC, RANDOM()
            LIMIT 1;
        `;

        const escalationResult = await query(escalationQuery, [
            role_id,
            branch_id,
            language,
        ]);
        employee_id = escalationResult[0]?.employee_id;
    }

    //! TODO: Automated Reassignment After 15 Minutes
    return employee_id;
};
