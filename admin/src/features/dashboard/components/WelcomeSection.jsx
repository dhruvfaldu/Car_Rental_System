import React from "react";
import { useAuth } from "@/features/auth/context/AuthContext";

const WelcomeSection = () => {
    const { user } = useAuth();
    return (
        <div className="mb-8">
            <h1 className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
                Welcome Back, {user?.name || "Admin"} 👋
            </h1>

            <p className="mt-2 text-sm font-medium text-muted-foreground">
                Here's what's happening with your car rental fleet today.
            </p>
        </div>
    );
};

export default WelcomeSection;