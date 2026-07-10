import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export const useDashboard = () => {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const response = await api.get("/dashboard/stats");
            return response.data?.data;
        },
        staleTime: 60 * 1000, // Cache for 1 minute
    });
};
