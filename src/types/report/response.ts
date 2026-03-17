import { ReportReason, ReportStatus } from "@/constants/report";

export interface ReportResponse {
    _id: string;
    reportedBy: string;
    reportedUser: string;
    reason: ReportReason;
    description?: string;
    image?: string;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
}
