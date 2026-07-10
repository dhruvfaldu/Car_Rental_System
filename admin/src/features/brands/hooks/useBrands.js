import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

export const useBrands = () => {
    const queryClient = useQueryClient();

    // Query to fetch all brands
    const { data: brands = [], isLoading, error } = useQuery({
        queryKey: ["brands"],
        queryFn: async () => {
            const response = await api.get("/brands");
            return response.data?.data || [];
        },
    });

    // Create mutation (uses multipart form data)
    const createBrandMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await api.post("/brands", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create brand");
        },
    });

    // Update mutation (uses multipart form data)
    const updateBrandMutation = useMutation({
        mutationFn: async ({ id, formData }) => {
            const response = await api.put(`/brands/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update brand");
        },
    });

    // Delete mutation
    const deleteBrandMutation = useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/brands/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete brand");
        },
    });

    return {
        brands,
        isLoading,
        error,
        createBrand: createBrandMutation.mutateAsync,
        isCreating: createBrandMutation.isPending,
        updateBrand: updateBrandMutation.mutateAsync,
        isUpdating: updateBrandMutation.isPending,
        deleteBrand: deleteBrandMutation.mutateAsync,
        isDeleting: deleteBrandMutation.isPending,
    };
};
