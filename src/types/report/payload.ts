import { ReportReason } from "@/constants/report";

export interface CreateReportPayload {
    reportedUser: string;
    reason: ReportReason;
    description?: string;
    image?: string;
}
