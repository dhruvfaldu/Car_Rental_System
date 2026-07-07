import api from "@/features/axios";

export const getCars = async (params) => {
    const response = await api.get("/cars", {
        params,
    });

    return response.data;
};

export const getCarById = async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
};