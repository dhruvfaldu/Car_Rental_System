import api from "../axios";

export const getMyInvoices = async () => {
    const { data } = await api.get("/invoices/my-invoices");
    return data;
};

export const getInvoiceById = async (id) => {
    const { data } = await api.get(`/invoices/${id}`);
    return data;
};

export const payInvoiceBalance = async ({ id, paymentMethod }) => {
    const { data } = await api.patch(`/invoices/${id}/pay`, { paymentMethod });
    return data;
};
