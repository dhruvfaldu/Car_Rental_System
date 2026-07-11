import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || "";
const cleanBaseUrl = rawBaseUrl.replace(/['"\s]/g, "") || "/api/v1";

const api = axios.create({
    baseURL: cleanBaseUrl,
    withCredentials: true,
    headers: {
        "X-App-Type": "admin",
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If token expired/invalid during an active session, auto-logout
        if (error.response?.status === 401) {
            try {
                const { queryClient } = await import("@/utils/queryClient");
                queryClient.setQueryData(["auth-me"], null);
            } catch (err) {
                console.error("Error clearing auth cache:", err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;