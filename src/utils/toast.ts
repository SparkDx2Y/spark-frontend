import toast from 'react-hot-toast'
import { getErrorMessage } from './errors'

export const showSuccess = (message: string) => {
    toast.success(message)
}

export const showError = (message: string) => {
    toast.error(message)
}

export const handleApiError = (error: unknown, defaultMessage?: string) => {
    const message = getErrorMessage(error, defaultMessage);
    toast.error(message);
}

export const showInfo = (message: string) => {
    toast(message)
}