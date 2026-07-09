import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
    const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100">
                <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
                <p className="mt-4 text-sm font-medium tracking-wide text-zinc-400 animate-pulse">
                    Verifying session...
                </p>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
