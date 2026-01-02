import { IChat, IChatMessage } from '@/types/shared/chat';
import { getRequest, postRequest } from './api';
import { ApiResponse } from '@/types/shared/api';

export const companyChatService = {
    getCompanyGroup: async (companyId: string): Promise<IChat | null> => {
        const response = await getRequest<ApiResponse<IChat>>(`/company/chat/${companyId}`);
        return response?.data || null;
    },

    getMessages: async (chatId: string): Promise<IChatMessage[]> => {
        const response = await getRequest<ApiResponse<IChatMessage[]>>(`/company/chat/messages/${chatId}`);
        return response?.data || [];
    },

    uploadFile: async (file: File): Promise<string | undefined> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await postRequest<ApiResponse<{ url: string }>>('/shared/upload', formData, {
            showToast: true
        });
        return response?.data?.url;
    }
};
