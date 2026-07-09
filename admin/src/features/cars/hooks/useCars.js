import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

export const useCars = (params = {}) => {
    const queryClient = useQueryClient();

    // Query to fetch cars (server-side pagination, search, filter)
    const { data, isLoading, error } = useQuery({
        queryKey: ["cars", params],
        queryFn: async () => {
            const response = await api.get("/cars", { params });
            return response.data;
        },
        placeholderData: (previousData) => previousData,
    });

    const cars = data?.data || [];
    const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

    // Create mutation
    const createCarMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await api.post("/cars", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cars"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            toast.success("Car created successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create car");
        },
    });

    // Update mutation
    const updateCarMutation = useMutation({
        mutationFn: async ({ id, formData }) => {
            const response = await api.put(`/cars/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cars"] });
            toast.success("Car updated successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update car");
        },
    });

    // Delete mutation
    const deleteCarMutation = useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/cars/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cars"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            toast.success("Car deleted successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete car");
        },
    });

    return {
        cars,
        pagination,
        isLoading,
        error,
        createCar: createCarMutation.mutateAsync,
        isCreating: createCarMutation.isPending,
        updateCar: updateCarMutation.mutateAsync,
        isUpdating: updateCarMutation.isPending,
        deleteCar: deleteCarMutation.mutateAsync,
        isDeleting: deleteCarMutation.isPending,
    };
};
