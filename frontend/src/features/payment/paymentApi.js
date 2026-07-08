import api from "../axios";

export const createPayment = async (payload) => {
    const { data } = await api.post("/payments", payload);
    return data;
};

export const createOrder = async (paymentId) => {
    const { data } = await api.post(`/payments/${paymentId}/order`);
    return data;
};

export const verifyPayment = async (payload) => {
    const { data } = await api.post("/payments/verify", payload);
    return data;
};
