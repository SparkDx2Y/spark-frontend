import { ReportReason, ReportStatus } from "@/constants/report";
import { ApiResponse } from "../api";

export interface ReportUserDetail {
    _id: string;
    name: string;
    email: string;
    isBlocked: boolean;
}

export interface AdminReportListItem {
    _id: string;
    reportedBy: ReportUserDetail;
    reportedUser: ReportUserDetail;
    reason: ReportReason;
    description?: string;
    image?: string;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
}

export type GetReportsResponse = ApiResponse<AdminReportListItem[]>;
export type UpdateReportStatusResponse = ApiResponse<AdminReportListItem>;
