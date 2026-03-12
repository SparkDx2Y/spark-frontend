import { api } from "@/lib/axios";
import { PAYMENT_ENDPOINTS } from "@/constants/api";

export const createCheckoutSession = async (planId: string): Promise<{ url: string }> => {
    const response = await api.post(PAYMENT_ENDPOINTS.CREATE_CHECKOUT_SESSION, { planId });
    return response.data.data;
};
