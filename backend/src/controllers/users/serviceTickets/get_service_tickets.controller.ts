import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/authRequest.type";
import { getServiceTicketsWithUserDetails } from "../../../services/user/serviceTicket/getServiceTicketsWithUserDetails.service";
import { ApiResponse } from "../../../utils/ApiResponse";

export const getServiceTicketsController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            ticket_status,
            department,
            service_type,
            ticket_priority,
            start_date,
            end_date,
            employee_id,
            employee_name,
            employee_email,
        } = req.body;

        console.log(req.body);

        const filters = {
            user_id: req.user?.id,
            ticket_status: ticket_status as string | undefined,
            department: department as string | undefined,
            service_type: service_type as string | undefined,
            ticket_priority: ticket_priority as string | undefined,
            start_date: start_date ? new Date(start_date as string) : undefined,
            end_date: end_date ? new Date(end_date as string) : undefined,
            employee_id: employee_id as string | undefined,
            employee_name: employee_name as string | undefined,
            employee_email: employee_email as string | undefined,
        };

        const tickets = await getServiceTicketsWithUserDetails(filters);
        const response =
            tickets?.map((ticket) => ({
                ticket_id: ticket?.ticket_id,
                department: ticket?.department,
                ticket_created_at: ticket?.ticket_created_at,
                query_text: ticket?.query_text,
                query_type: ticket?.query_type,
            })) || [];
        ApiResponse.send(res, 200, "Service tickets fetched successfully", {
            tickets,
        });
    } catch (error) {
        next(error);
    }
};
