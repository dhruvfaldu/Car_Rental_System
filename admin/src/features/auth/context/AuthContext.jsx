import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();

    // Fetch current user session
    const {
        data: user,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["auth-me"],
        queryFn: async () => {
            try {
                const response = await api.get("/auth/me");
                const userData = response.data?.data;
                if (userData && userData.role === "admin") {
                    return userData;
                }
                return null;
            } catch (error) {
                return null;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000, // Cache session status for 5 mins
    });

    const isAuthenticated = !!user;

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: async ({ email, password }) => {
            const response = await api.post("/auth/login", { email, password });
            return response.data?.data;
        },
        onSuccess: (data) => {
            if (data.role !== "admin") {
                toast.error("Access denied. Only administrators are allowed.");
                return;
            }
            queryClient.setQueryData(["auth-me"], data);
            toast.success(`Welcome back, ${data.name}!`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Invalid credentials");
        },
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: async ({ name, email, password, phone }) => {
            const response = await api.post("/auth/register", {
                name,
                email,
                password,
                phone,
                role: "admin", // Explicitly register as admin
            });
            return response.data?.data;
        },
        onSuccess: () => {
            toast.success("Admin registered successfully! Please log in.");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Registration failed");
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: async () => {
            await api.post("/auth/logout");
        },
        onSuccess: () => {
            queryClient.setQueryData(["auth-me"], null);
            queryClient.clear(); // Flush cache on logout
            toast.success("Logged out successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Logout failed");
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login: loginMutation.mutateAsync,
                isLoggingIn: loginMutation.isPending,
                register: registerMutation.mutateAsync,
                isRegistering: registerMutation.isPending,
                logout: logoutMutation.mutateAsync,
                isLoggingOut: logoutMutation.isPending,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
