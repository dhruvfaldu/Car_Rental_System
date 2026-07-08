import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getProfile, login, logoutUser, register } from "./authApi";
import { loginSuccess, setUser, logout } from "@/store/slices/authSlice";
import { Navigate, useNavigate } from "react-router-dom";

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: register,
    });
};

export const useLoginMutation = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: login,

        onSuccess: (data) => {
            dispatch(loginSuccess(data));
        },
    });
};

export const useProfileQuery = () => {
    const dispatch = useDispatch();

    return useQuery({
        queryKey: ["me"],

        queryFn: getProfile,

        retry: false,

        onSuccess: (data) => {
            dispatch(setUser(data.user));
        },
    });
};


export const useLogoutMutation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,

        onSuccess: () => {
            dispatch(logout());

            queryClient.clear();

            navigate("/login");
        },
    });
};