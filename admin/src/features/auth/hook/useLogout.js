import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutSuccess } from "@/store/slices/authSlice";
import { logout as logoutApi } from "../services/authService";

export const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await logoutApi();
            dispatch(logoutSuccess());
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (err) {
            // Even if API logout fails, clear frontend session
            dispatch(logoutSuccess());
            toast.error("Logout API failed, cleared local session");
            navigate("/login");
        }
    };

    return { logout };
};
