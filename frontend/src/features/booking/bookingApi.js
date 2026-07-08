import api from "../axios";

export const getCarById = async (id) => {
    const { data } = await api.get(`/cars/${id}`);
    return data;
};

export const createBooking = async (payload) => {
    const { data } = await api.post("/bookings", payload);
    return data;
};

export const getBookingById = async (bookingId) => {
    const { data } = await api.get(`/bookings/${bookingId}`);
    return data;
};

export const getMyBookings = async (params) => {
    const { data } = await api.get("/bookings/my-bookings", { params });
    return data;
};