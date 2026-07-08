import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "@/store/slices/authSlice";
import { getMe } from "../services/authService";

export const useMe = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchMe = async () => {
            // If already loaded or authenticated, do not fetch again
            if (user) {
                dispatch(setLoading(false));
                return;
            }
            dispatch(setLoading(true));
            try {
                const currentUser = await getMe();
                if (currentUser && currentUser.role === "admin") {
                    dispatch(setUser(currentUser));
                } else {
                    dispatch(setUser(null));
                }
            } catch (err) {
                dispatch(setUser(null));
            }
        };

        fetchMe();
    }, [dispatch]);

    return { user, isAuthenticated, isLoading };
};
