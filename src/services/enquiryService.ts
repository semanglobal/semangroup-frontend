/*eslint-disable @typescript-eslint/no-explicit-any*/
import api from "./api";

export const EnquiryService = {
    sendEnquiry: async (data: any): Promise<any> => {
        const response = await api.post(`/api/enquire`, data);
        return response.data;
    },
};