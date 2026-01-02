import { getRequest, postRequest } from './api';

export const companyChatService = {
    getCompanyGroup: async (companyId: string) => {
        const response = await getRequest<any>(`/company/chat/${companyId}`);
        return response?.data;
    },

    getMessages: async (chatId: string) => {
        const response = await getRequest<any>(`/company/chat/messages/${chatId}`);
        return response?.data;
    },

    // Note: Sending messages is largely handled via Socket.io, 
    // but if we need an HTTP fallback or for file uploads, we might add it here.
    // For file uploads:
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await postRequest<any>('/shared/upload', formData, {
            showToast: true
            // Headers are handled by api/axios usually, but for FormData we might need to let browser set boundary
            // The api wrapper properly handles FormData check to set/unset Content-Type
        });
        return response?.data?.url;
    }
};
