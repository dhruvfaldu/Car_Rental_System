import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoaderCircle } from "lucide-react";

export default function PublicRoutes() {
    const { isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);

    if (isCheckingAuth) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}
    