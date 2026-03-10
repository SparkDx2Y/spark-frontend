import { SUBSCRIPTION_ENDPOINTS } from '@/constants/api';
import { getServerConfig } from '../base';
import type { SubscriptionPlan } from "@/types/subscription";

export async function getActivePlansData(): Promise<SubscriptionPlan[]> {
    try {
        const { token, apiUrl } = await getServerConfig();
        const response = await fetch(`${apiUrl}${SUBSCRIPTION_ENDPOINTS.GET_PLANS}`, {
            headers: { 'Cookie': `accessToken=${token}` },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch active plans');
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error fetching active plans:", error);
        return [];
    }
}

export async function getCurrentPlanData(): Promise<SubscriptionPlan | null> {
    try {
        const { token, apiUrl } = await getServerConfig();
        const response = await fetch(`${apiUrl}${SUBSCRIPTION_ENDPOINTS.GET_CURRENT}`, {
            headers: { 'Cookie': `accessToken=${token}` },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch current plan');
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error fetching current plan:", error);
        return null;
    }
}
