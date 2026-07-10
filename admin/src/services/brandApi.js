import api from "@/api/axios";

export const createBrand = async (data) => {
    const response = await api.post("/brands", data);

    return response.data;
};