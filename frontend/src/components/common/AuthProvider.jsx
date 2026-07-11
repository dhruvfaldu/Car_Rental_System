import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

import { getProfile } from "@/features/auth/authApi";
import { setUser, finishChecking } from "@/store/slices/authSlice";

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["me"],
        queryFn: getProfile,
        retry: false,
    });

    useEffect(() => {
        if (isSuccess && data) {
            // data is ApiResponse { success: true, message: "...", data: user }
            const user = data.data;
            if (user && (user.role === "admin" || user.role === "staff")) {
                dispatch(finishChecking());
            } else {
                dispatch(setUser(user));
            }
        } else if (isError) {
            dispatch(finishChecking());
        } else if (!isLoading) {
            dispatch(finishChecking());
        }
    }, [data, isSuccess, isError, isLoading, dispatch]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground animate-pulse font-medium">
                        Initializing session...
                    </p>
                </div>
            </div>
        );
    }

    return children;
}
