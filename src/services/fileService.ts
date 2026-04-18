import { api } from "@/lib/axios";
import { FILE_ENDPOINTS } from "@/constants/api";
import { ApiResponse } from "@/types/api";

export const uploadFile = async (file: File | Blob, startTime?: number): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    if (startTime !== undefined) {
        formData.append("startTime", startTime.toString());
    }

    const response = await api.post<ApiResponse<{ url: string }>>(FILE_ENDPOINTS.UPLOAD, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.data.url;
};

export const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", file);
    });

    const response = await api.post<ApiResponse<{ urls: string[] }>>(FILE_ENDPOINTS.UPLOAD_MULTIPLE, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.data.urls;
};

export const uploadChatMedia = async (file: File | Blob, type: 'image' | 'audio'): Promise<string> => {
    const formData = new FormData();

    // Check if file is a File or Blob.if its a file  then append to formData 
    if (file instanceof File) {
        formData.append("file", file);
    } else {
        const mimeType = file.type.split(';')[0];
        const extension = mimeType.split('/')[1] || 'webm';
        formData.append("file", file, `recording.${extension}`);
    }

    formData.append("type", type);

    const response = await api.post<ApiResponse<{ url: string }>>(FILE_ENDPOINTS.UPLOAD_CHAT_MEDIA, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.data.url;
};
