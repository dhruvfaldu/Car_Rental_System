import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

export const useBookings = (params = {}) => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["bookings", params],
        queryFn: async () => {
            const response = await api.get("/bookings", { params });
            return response.data;
        },
        placeholderData: (previousData) => previousData,
    });

    const bookings = data?.data?.bookings || data?.data || [];
    const pagination = data?.data?.pagination || data?.pagination || { totalRecords: 0, page: 1, limit: 10, totalPages: 1 };

    const confirmMutation = useMutation({
        mutationFn: async ({ bookingId, pickupDateTime, confirmationNote }) => {
            const response = await api.patch(`/bookings/${bookingId}/confirm`, {
                pickupDateTime,
                confirmationNote,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            toast.success("Booking confirmed successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to confirm booking");
        },
    });

    const rejectMutation = useMutation({
        mutationFn: async ({ bookingId, rejectionReason }) => {
            const response = await api.patch(`/bookings/${bookingId}/reject`, {
                rejectionReason,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            toast.success("Booking rejected successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to reject booking");
        },
    });

    return {
        bookings,
        pagination,
        isLoading,
        error,
        confirmBooking: confirmMutation.mutateAsync,
        isConfirming: confirmMutation.isPending,
        rejectBooking: rejectMutation.mutateAsync,
        isRejecting: rejectMutation.isPending,
    };
};
