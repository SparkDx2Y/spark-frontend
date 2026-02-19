import { GetReportsResponse } from "@/types/admin/report";
import { getServerConfig } from "../base";

export async function getServerReports(): Promise<GetReportsResponse> {
    const { token, apiUrl } = await getServerConfig();

    const res = await fetch(`${apiUrl}/admin/reports`, {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `accessToken=${token}`,
        },
        next: { tags: ['admin-reports'] },
        cache: 'no-store'
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend error: ${res.status} - ${errorText}`);
        throw new Error(`Failed to fetch reports: ${res.status} ${errorText}`);
    }

    return res.json();
}
