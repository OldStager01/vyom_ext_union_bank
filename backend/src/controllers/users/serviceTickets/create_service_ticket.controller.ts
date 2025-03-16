import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/authRequest.type";
import { InternalServerError } from "../../../utils/errors";
import { createServiceTicketService } from "../../../services/user/serviceTicket/createServiceTicket.service";

type Priority = "high" | "low" | "medium" | "critical";
type RoutingDestination = "branch" | "central_office";
type Department = "operations" | "loan";
type QueryType = "text" | "video" | "predefined";
export const createServiceTicketController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req?.user?.id;
        const {
            query_id,
            priority,
            query_type,
            success,
            routing_destination,
            department,
            service_type,
            request_category,
            transcribed_text,
            translated_text,
            language,
        } = demoResponseVideo; //req.body;
        if (!success) {
            throw new InternalServerError("Query failed to process");
        }
        await createServiceTicketService({
            query_id,
            priority,
            query_type,
            routing_destination,
            department,
            service_type,
            request_category,
            transcribed_text,
            translated_text,
            language,
        });
    } catch (error) {
        next(error);
    }
};

const demoResponseVideo = {
    query_id: "a2a836ff-9807-40df-b384-a833cfab7e18",
    priority: "high" as Priority,
    query_type: "video" as QueryType,
    success: true,
    timestamp: "2025-03-15T22:13:34.933770",
    routing_destination: "branch" as RoutingDestination,
    department: "operations" as Department,
    service_type: "identity_updates",
    request_category: "account_information",
    language: "hindi",
    transcribed_text:
        " मेरा बैंक अकार्ड का चेक    कबुक खतम हो गया है और मुझे अब यह से रिन्यो करना है       इसलिए मैंने यह क्वेरी सब्मिट किये",
    translated_text:
        "My bank account's checkbook has finished, and I need to renew it. Therefore, I have submitted this query.",
};

const demoResponseText = {
    priority: "high" as Priority,
    query_type: "text" as QueryType,
    status: "success", // Change here
    category: "operations", // Change here
    subcategory: "account_services", // Change here
};
