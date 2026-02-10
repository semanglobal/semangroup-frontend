/*eslint-disable @typescript-eslint/no-explicit-any*/
import type { ApplicationCreate, ApplicationGet } from "../types/application";
import api from "./api";

export const DashboardService = {
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

    getAnalytics: async (): Promise<any> => {
        const response = await api.get(`/api/application/analytics/dashboard`)
        return response.data.data
    },

    getMonthlyRevenue: async (year: number): Promise<any> => {
        const response = await api.get(`/api/application/analytics/monthly-revenue?year=${year}`)
        return response.data
    },
};