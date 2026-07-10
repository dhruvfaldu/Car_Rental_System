import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

export const useCategories = () => {
    const queryClient = useQueryClient();

    // Query to fetch all categories
    const { data: categories = [], isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await api.get("/categories");
            return response.data?.data || [];
        },
    });

    // Create mutation (uses multipart form data)
    const createCategoryMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await api.post("/categories", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to create category");
        },
    });

    // Update mutation (uses multipart form data)
    const updateCategoryMutation = useMutation({
        mutationFn: async ({ id, formData }) => {
            const response = await api.put(`/categories/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update category");
        },
    });

    // Delete mutation
    const deleteCategoryMutation = useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/categories/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete category");
        },
    });

    return {
        categories,
        isLoading,
        error,
        createCategory: createCategoryMutation.mutateAsync,
        isCreating: createCategoryMutation.isPending,
        updateCategory: updateCategoryMutation.mutateAsync,
        isUpdating: updateCategoryMutation.isPending,
        deleteCategory: deleteCategoryMutation.mutateAsync,
        isDeleting: deleteCategoryMutation.isPending,
    };
};
