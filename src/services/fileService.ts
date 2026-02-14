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

    const response = await api.post<{ url: string }>(FILE_ENDPOINTS.UPLOAD_CHAT_MEDIA, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.url;
};
