import axios from "axios";

/**
 * Handles Axios errors specifically to get backend error messages.
 */

export const getErrorMessage = (error: unknown, defaultMessage: string = "Something went wrong"): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || defaultMessage;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return defaultMessage;
};
