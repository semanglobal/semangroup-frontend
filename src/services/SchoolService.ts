import type { ChangeStatusType, SchoolData } from '../types/schoolDataType';
import type { UserEditType } from '../types/userType';
import api from "./api";

export const SchoolService = {
    getAllSchools: async (): Promise<SchoolData[]> => {
        try {
            const response = await api.get("/api/reports/all");

            return response.data;
        } catch (error) {
            console.log(error);
            throw error
        }
    },

    getAllSchoolStat: async () => {
        const response = await api.get(`/api/all-school-stats`);
        return response.data;
    },

    changeStatus: async (data: ChangeStatusType): Promise<UserEditType> => {
        const response = await api.put("/api/change-school-status", data);
        return response.data;
    },

    updateAllSchoolData: async (data: string[]): Promise<UserEditType> => {
        const response = await api.put(`/api/update-all-schools-data`, {domains: data});
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/admin/api/AdminUser/${id}`);
    },
};