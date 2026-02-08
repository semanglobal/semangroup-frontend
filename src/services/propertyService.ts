import type { DecryptedResponse } from '../types/decriptType';
import type { sendVerificationCodeType, LoginType, resetPassword, changePassword } from '../types/loginType';
import type { PropertyCreateType, PropertyType } from '../types/propertyType';
import api from "./api";

export const PropertyService = {
    // addProperty: async (data: PropertyCreateType): Promise<DecryptedResponse> => {
    addProperty: async (data: PropertyCreateType) => {
        try {
            const response = await api.post("/api/property", data);
            // console.log(response);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    updateProperty: async (
        data: Partial<Omit<PropertyType, "createdAt" | "updatedAt">>,
        id: string
    ) => {
        try {
            const response = await api.put(`/api/property/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },


    getAllProperties: async (): Promise<PropertyType[]> => {
        try {
            const response = await api.get(`/api/property`)
            return response.data.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    },

    deleteProperty: async (id: string): Promise<void> => {
        try {
            const response = await api.delete(`/api/property/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    },

    sendVerificationEmail: async (payload: sendVerificationCodeType): Promise<sendVerificationCodeType> => {
        try {
            const response = await api.post(`/api/auth/send-verification-code`, payload)
            return response.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    },

    changePassword: async (payload: changePassword): Promise<changePassword> => {
        try {
            const response = await api.post(`/api/Auth/changePassword`, payload)
            return response.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    },
};