import { query } from "../../../../config/db";
import { createRecord } from "../../../../db/models/records";
import { tables } from "../../../../db/tables";
import {
    VideoKycSessionStatusType,
    VideoKycSessionType,
} from "../../../../types/tables/video_kyc_session.type";
import { ValidationError } from "../../../../utils/errors";

export async function agentAllotment(id: string, language: string) {
    try {
        const employees = await query(
            `SELECT * FROM ${tables.employees} as t1
                    WHERE role = 'kyc_agent' AND status = 'active' AND $1 = ANY (spoken_languages)
                    ORDER BY (
                        SELECT COUNT(*) FROM ${tables.videoKYCSessions} as t2 WHERE t2.agent_id = t1.id
                    ) ASC
                    LIMIT 1`,
            [language]
        );

        if (!employees || employees.length === 0) {
            throw new ValidationError("No kyc agent available");
        }

        const employee = employees[0];

        const meet_link = "demoMeetLink@video.com";

        await createRecord<VideoKycSessionType>(tables.videoKYCSessions, {
            user_id: id,
            agent_id: employee.id,
            scheduled_at: new Date(Date.now() + 60 * 60 * 1000),
            meet_link,
            status: "scheduled" as VideoKycSessionStatusType,
        });
        const { password, refresh_token, ...employeeWC } = employee;

        return { employee: employeeWC, meet_link };
    } catch (error) {
        throw error;
    }
}
