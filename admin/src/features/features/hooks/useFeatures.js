import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

export const useFeatures = () => {
    const queryClient = useQueryClient();

    // Query to fetch all features
    const { data: features = [], isLoading, error } = useQuery({
        queryKey: ["features"],
        queryFn: async () => {
            const response = await api.get("/features");
            return response.data?.data || [];
        },
    });

    // Create mutation
    const createFeatureMutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.post("/features", data);
            return response.data?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["features"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            toast.success("Feature created successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create feature");
        },
    });

    // Update mutation
    const updateFeatureMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await api.put(`/features/${id}`, data);
            return response.data?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["features"] });
            toast.success("Feature updated successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update feature");
        },
    });

    // Delete mutation
    const deleteFeatureMutation = useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/features/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["features"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            toast.success("Feature deleted successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete feature");
        },
    });

    return {
        features,
        isLoading,
        error,
        createFeature: createFeatureMutation.mutateAsync,
        isCreating: createFeatureMutation.isPending,
        updateFeature: updateFeatureMutation.mutateAsync,
        isUpdating: updateFeatureMutation.isPending,
        deleteFeature: deleteFeatureMutation.mutateAsync,
        isDeleting: deleteFeatureMutation.isPending,
    };
};
