import api from "../axios";


export const getCars = async (params) => {
    const { data } = await api.get("/cars", {
        params,
    });

    return data;
};

export const getCarBySlug = async (slug) => {
    const { data } = await api.get(`/cars/slug/${slug}`);

    return data;
};