import { API_BASE_URL } from '@/constants/api'
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
    response => response, error => {
        const status = error.response?.status;
        const message = error.response?.data?.message;


        if(status === 403 && message === 'Your account has been blocked by Admin. Please contact support.' && !isBlockedHandled) {
            isBlockedHandled = true;
            store.dispatch(logout())
            showError(message)
            window.location.replace('/login');
        }

        return Promise.reject(error);
    }
)