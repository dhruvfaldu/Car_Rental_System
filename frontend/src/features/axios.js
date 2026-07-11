import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
        "X-App-Type": "customer",
    },
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log("Unauthorized");
        }

        if (error.response?.status === 403) {
            console.log("Forbidden");
        }

        if (error.response?.status >= 500) {
            console.log("Server Error");
        }

        return Promise.reject(error);
    }
);

export default api;