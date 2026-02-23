import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { REPORT_ENDPOINTS } from "@/constants/api/report";
import { CreateReportPayload } from "@/types/report/payload";
import { ReportResponse } from "@/types/report/response";

export const createReport = async (payload: CreateReportPayload): Promise<ApiResponse<ReportResponse>> => {
    const response = await api.post<ApiResponse<ReportResponse>>(REPORT_ENDPOINTS.CREATE, payload);
    return response.data;
};
