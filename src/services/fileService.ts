import { api } from "@/lib/axios";
import { FILE_ENDPOINTS } from "@/constants/api";

export const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ url: string }>(FILE_ENDPOINTS.UPLOAD, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.url;
};

export const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", file);
    });

    const response = await api.post<{ urls: string[] }>(FILE_ENDPOINTS.UPLOAD_MULTIPLE, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.urls;
};
