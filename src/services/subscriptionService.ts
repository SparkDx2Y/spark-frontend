import { api } from "@/lib/axios";
import { SUBSCRIPTION_ENDPOINTS } from "@/constants/api";
import type { SubscriptionPlan } from "@/types/subscription";

export const getActivePlans = async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get(SUBSCRIPTION_ENDPOINTS.GET_PLANS);
    return response.data.data;
};

export const getCurrentPlan = async (): Promise<SubscriptionPlan> => {
    const response = await api.get(SUBSCRIPTION_ENDPOINTS.GET_CURRENT);
    return response.data.data;
};


