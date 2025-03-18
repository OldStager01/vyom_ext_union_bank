import { z } from "zod";
import { VideoKycSessionSchema } from "../../schemas/video_kyc_session";

export type VideoKycSessionType = z.infer<typeof VideoKycSessionSchema>;
export type VideoKycSessionStatusType =
    | "scheduled"
    | "completed"
    | "failed"
    | "rejected";
