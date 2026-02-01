/*eslint-disable @typescript-eslint/no-explicit-any*/
import api from "./api";

export const ProfileService = {
    getProfile: async (): Promise<any> => {
        const response = await api.get("/api/auth/getProfile");
        return response.data;
    },

    updateProfile: async (data: any): Promise<any> => {
        const response = await api.put(`/api/auth/updateProfile`, data);
        return response.data;
    },
};