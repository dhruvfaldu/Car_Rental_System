import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || "";
const cleanBaseUrl = rawBaseUrl.replace(/['"\s]/g, "") || "/api/v1";

console.log("Axios Config - Raw VITE_API_URL:", JSON.stringify(import.meta.env.VITE_API_URL));
console.log("Axios Config - Cleaned baseURL:", JSON.stringify(cleanBaseUrl));

const api = axios.create({
    baseURL: cleanBaseUrl,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If token expired/invalid during an active session, auto-logout
        if (error.response?.status === 401) {
            // Lazy-import to avoid circular dependency at module init time
            const { store } = await import("@/store");
            const { logoutSuccess } = await import("@/store/slices/authSlice");
            const state = store.getState();
            if (state.auth.isAuthenticated) {
                store.dispatch(logoutSuccess());
            }
        }
        return Promise.reject(error);
    }
);

export default api;