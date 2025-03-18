import { getRecords, updateRecord } from "../../../../db/models/records";
import { tables } from "../../../../db/tables";
import { RegistrationStatusType } from "../../../../types/tables/user.type";
import {
    VideoKycSessionStatusType,
    VideoKycSessionType,
} from "../../../../types/tables/video_kyc_session.type";
import { UnauthorizedError, ValidationError } from "../../../../utils/errors";

export async function kycStatusUpdate(
    agent_id: string,
    kyc_session_id: string,
    status: VideoKycSessionStatusType
) {
    try {
        const videoKycSessions = await getRecords<VideoKycSessionType>(
            tables.videoKYCSessions,
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: kyc_session_id,
                    },
                ],
            }
        );

        if (!videoKycSessions || videoKycSessions.length === 0) {
            throw new ValidationError("No video kyc session found");
        }
        if (videoKycSessions[0]?.agent_id !== agent_id) {
            throw new UnauthorizedError("Unauthorized: Invalid agent");
        }
        if (videoKycSessions[0]?.status !== "scheduled") {
            throw new ValidationError("Video kyc session is not scheduled");
        }

        const user_id = videoKycSessions[0]?.user_id;

        if (!user_id) throw new ValidationError("No user found");

        // Update the User status
        await updateRecord<VideoKycSessionType>(
            tables.videoKYCSessions,
            {
                status,
            },
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: kyc_session_id,
                    },
                ],
            }
        );

        let kyc_status: "pending" | "approved" | "rejected";
        let registrationStatus: RegistrationStatusType;

        if (status === "completed") {
            kyc_status = "approved";
            registrationStatus = "account";
        } else if (status === "rejected") {
            kyc_status = "pending";
            registrationStatus = "vkyc";
        } else {
            throw new ValidationError("Invalid status");
        }

        await updateRecord(
            tables.users,
            {
                kyc_status,
                registration_status: registrationStatus,
            },
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: user_id,
                    },
                ],
            }
        );
    } catch (error) {
        throw error;
    }
}
