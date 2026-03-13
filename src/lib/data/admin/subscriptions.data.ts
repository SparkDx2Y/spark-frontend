import { ADMIN_ENDPOINTS } from '@/constants/api';
import { getServerConfig } from '../base';
import type { SubscriptionPlan, GetSubscriptionsResponse } from "@/types/subscription";

/**
 * SERVER-SIDE ONLY: Fetch Subscription Plans
 */
export async function getSubscriptionsData(page: number = 1, limit: number = 6): Promise<GetSubscriptionsResponse> {
    try {
        const { token, apiUrl } = await getServerConfig();
        const response = await fetch(`${apiUrl}${ADMIN_ENDPOINTS.GET_SUBSCRIPTIONS}?page=${page}&limit=${limit}`, {
            headers: { 'Cookie': `accessToken=${token}` },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch subscriptions data');
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return { plans: [], pagination: { page: 1, limit: 6, total: 0, totalPages: 0 } };
    }
}
