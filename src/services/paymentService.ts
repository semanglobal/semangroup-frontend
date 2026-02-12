/*eslint-disable @typescript-eslint/no-explicit-any*/
import type { MakePaymentType } from "../types/paymentType";
import api from "./api";

export const PaymentService = {
    makePayment: async (data: MakePaymentType): Promise<any> => {
        const response = await api.post("/api/payment", data);
        return response.data;
    },

    verifyPayment: async (reference: string): Promise<any> => {
        const response = await api.get(`/api/payment/verify/${reference}`);
        return response.data;
    },

    getPayments: async (): Promise<any> => {
        try {
            const response = await api.get(`/api/payment`)
            return response.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    },

    getApplicationById: async (id: string): Promise<any> => {
        try {
            const response = await api.get(`/api/payment/${id}`)
            return response.data.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    },
};