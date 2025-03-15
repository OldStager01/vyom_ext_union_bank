import { createRecord } from "../../../db/models/records";
import { tables } from "../../../db/tables";
import { QuerySchemaType } from "../../../types/tables/query.type";
import { UnauthorizedError, ValidationError } from "../../../utils/errors";
import { getUser } from "../getUser.service";
import { getCombinedData } from "./combinedData.service";

export const queryUploadService = async ({
    user_id,
    query_type,
    query_text,
    video_url,
    predefined_query,
    category,
    sub_category,
}: Partial<QuerySchemaType>) => {
    if (!user_id) {
        throw new ValidationError("User ID is required");
    }
    // Verify the user
    const users = await getUser(user_id as string);
    if (!users || users.length === 0) {
        throw new UnauthorizedError("User not found");
    }
    const user = users[0];
    // Get the branch id from the user
    const branchId = user?.branch_id;

    if (!branchId) {
        throw new UnauthorizedError("Branch not found");
    }

    const query: Partial<QuerySchemaType> = {
        user_id: user_id as string,
        branch_id: branchId,
        query_type: query_type as "text" | "predefined" | "video",
    };

    if (!video_url && !query_text && !predefined_query) {
        throw new ValidationError(
            "At least one of video_url, query_text or predefined_query is required"
        );
    }

    // Case 1 : Video Query: Send for analysis at AIML server.
    if (query_type === "video") {
        query.video_url = video_url;
        if (query_text) {
            query.query_text = query_text;
        }
    }
    // Case 2 : Text Query: Send for analysis at AIML server.
    else if (query_type === "text") {
        query.query_text = query_text;
    }
    // Case 3 : Predefined Query: Create a service ticket.
    else if (query_type === "predefined") {
        query.predefined_query = predefined_query;
        // query.category = category;
        // query.sub_category = sub_category;
    } else {
        throw new ValidationError("Invalid query type");
    }
    query.status = "processing";
    const result = await createRecord<Partial<QuerySchemaType>>(
        tables.queries,
        query
    );
    const queryId = result[0].id;
    // Attach user's aggregated financial data of the profile.
    const combinedData = await getCombinedData(user_id as string);
    const userData = { ...combinedData, query_id: queryId };
    console.log(userData);
};

/*
forward = ['branch','central_office']
department: ['operations','loans']
sub_department: ['account_support','customer_support','kyc_agent','operations_manager','operations_lead','loan_officer','branch_support','loans_manager','loans_lead']
*/
