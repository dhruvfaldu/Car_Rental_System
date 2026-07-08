import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginStart, loginSuccess, loginFailure } from "@/store/slices/authSlice";
import { login as loginApi, logout as logoutApi } from "../services/authService";

export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);

    const login = async (data) => {
        dispatch(loginStart());
        try {
            const user = await loginApi(data.email, data.password);
            
            // Check authorization: only admin role is allowed on admin panel
            if (user.role !== "admin") {
                toast.error("Access denied: Admin role required");
                // Immediately call logout to clear the cookie
                await logoutApi();
                dispatch(loginFailure("Access denied: Admin role required"));
                return false;
            }

            dispatch(loginSuccess(user));
            toast.success(`Welcome back, ${user.name}!`);
            navigate("/");
            return true;
        } catch (err) {
            const message = err.response?.data?.message || "Login failed. Please try again.";
            dispatch(loginFailure(message));
            toast.error(message);
            return false;
        }
    };

    return { login, isLoading, error };
};
