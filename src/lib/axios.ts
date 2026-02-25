import { API_BASE_URL, AUTH_ENDPOINTS } from '@/constants/api'
import { logout } from '@/store/features/auth/authSlice';
import { store } from '@/store/store';
import { showError } from '@/utils/toast';
import axios from 'axios'


export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

let isBlockedHandled = false;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // 1. Handle Token Expiration (401)
        if (status === 401 && !originalRequest._retry && originalRequest.url !== AUTH_ENDPOINTS.REFRESH_TOKEN) {
            originalRequest._retry = true;
            try {

                await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN);

                
                return api(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());

                // Prevent infinite redirect loops on public pages
                const publicPaths = ['/login', '/signup', '/'];
                const isPublicPath = publicPaths.includes(window.location.pathname);

                if (!isPublicPath) {
                    window.location.replace('/login');
                }

                return Promise.reject(refreshError);
            }
        }

        // 2. Handle Blocked User (403)
        if (status === 403 && message === 'Your account has been blocked by Admin. Please contact support.' && !isBlockedHandled) {
            isBlockedHandled = true;
            store.dispatch(logout());
            showError(message);
            window.location.replace('/login');
        }

        return Promise.reject(error);
    }
);