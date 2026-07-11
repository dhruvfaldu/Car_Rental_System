import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

export const useUsers = (params = {}) => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["users", params],
        queryFn: async () => {
            const response = await api.get("/users", { params });
            return response.data;
        },
        placeholderData: (previousData) => previousData,
    });

    const users = data?.data?.users || data?.data || [];
    const pagination = data?.data?.pagination || data?.pagination || { totalRecords: 0, page: 1, limit: 10, totalPages: 1 };

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }) => {
            const response = await api.put(`/users/${userId}/role`, { role });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User role updated successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update user role");
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (userId) => {
            const response = await api.delete(`/users/${userId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User deleted successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete user");
        },
    });

    return {
        users,
        pagination,
        isLoading,
        error,
        updateUserRole: updateRoleMutation.mutateAsync,
        isUpdatingRole: updateRoleMutation.isPending,
        deleteUser: deleteUserMutation.mutateAsync,
        isDeleting: deleteUserMutation.isPending,
    };
};
