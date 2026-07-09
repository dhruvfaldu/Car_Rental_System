import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "@/store/slices/authSlice";
import { getMe } from "../services/authService";

export const useMe = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const hasFetched = useRef(false);

    useEffect(() => {
        // Prevent double-fetch in React StrictMode and across re-renders
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchMe = async () => {
            dispatch(setLoading(true));
            try {
                const currentUser = await getMe();
                if (currentUser && currentUser.role === "admin") {
                    dispatch(setUser(currentUser));
                } else {
                    // Non-admin user logged in — reject access
                    dispatch(setUser(null));
                }
            } catch {
                // No valid session cookie or network error — not authenticated
                dispatch(setUser(null));
            }
        };

        fetchMe();
    }, [dispatch]);

    return { user, isAuthenticated, isLoading };
};
