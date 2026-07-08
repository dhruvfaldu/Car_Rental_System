import { useQuery, useMutation } from "@tanstack/react-query";
import { getMyBookings, createBooking, getBookingById, cancelBooking } from "./bookingApi";

export default function useMyBookings(params) {
    return useQuery({
        queryKey: ["bookings", params],
        queryFn: () => getMyBookings(params),
    });
}

export function useCreateBooking() {
    return useMutation({
        mutationFn: createBooking,
    });
}

export function useBookingDetails(bookingId) {
    return useQuery({
        queryKey: ["booking", bookingId],
        queryFn: () => getBookingById(bookingId),
        enabled: !!bookingId,
    });
}

export function useCancelBooking() {
    return useMutation({
        mutationFn: cancelBooking,
    });
}