import api from "./api";

export const fileUpload = async (formData: FormData): Promise<string> => {
    const response = await api.post("/api/File/upload", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    // console.log(response);
    return response.data;
};

export const fileDownload = async (data: Record<string, unknown>): Promise<unknown> => {
    const response = await api.post("/admin/api/FileUpload/Download", data);
    return response.data;
};