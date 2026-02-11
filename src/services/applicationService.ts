/*eslint-disable @typescript-eslint/no-explicit-any*/
import type { ApplicationCreate, ApplicationGet } from "../types/application";
import api from "./api";

export const ApplicationService = {
    createApplication: async (data: any): Promise<{
        success?: boolean;
        message: string;
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: string;
    }> => {
        const response = await api.post(`/api/application`, data);
        return response.data;
    },

    updateApplication: async (data: any, id: string): Promise<any> => {
        const response = await api.put(`/api/application/${id}`, data);
        return response.data;
    },

    deleteApplication: async (id: string): Promise<any> => {
        const response = await api.delete(`/api/application/${id}`);
        return response.data;
    },

    getAllApplications: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        paymentStatus?: string;
        siteName?: string;
    }): Promise<ApplicationGet> => {
        try {
            const queryParams = new URLSearchParams();

            if (params?.page !== undefined)
                queryParams.append('page', params.page.toString());

            if (params?.limit !== undefined)
                queryParams.append('limit', params.limit.toString());

            if (params?.search)
                queryParams.append('search', params.search);

            if (params?.paymentStatus)
                queryParams.append('paymentStatus', params.paymentStatus);

            if (params?.siteName)
                queryParams.append('siteName', params.siteName);

            const response = await api.get(
                `/api/application?${queryParams.toString()}`
            );

            return {
                data: response.data.data,
                pagination: response.data.pagination,
            };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    getApplicationById: async (id: string): Promise<any> => {
        try {
            const response = await api.get(`/api/application/${id}`)
            return response.data.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    },
};