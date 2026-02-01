import type { DecryptedResponse } from '../types/decriptType';
import type { sendVerificationCodeType, LoginType, resetPassword, changePassword } from '../types/loginType';
import api from "./api";

export const AuthService = {
    login: async (data: LoginType): Promise<DecryptedResponse> => {
        try {
            const response = await api.post("/api/auth/login", data);
            console.log(response);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    confirmEmail: async (payload: { email: string, code: string, }): Promise<void> => {
        try {
            const response = await api.put(`/api/auth/verify-email`, payload)
            return response.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    },

    resetPassword: async (payload: resetPassword): Promise<resetPassword> => {
        try {
            const response = await api.post(`/api/auth/reset-password`, payload)
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