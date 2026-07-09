import React from "react";
import { useAuth } from "@/features/auth/context/AuthContext";

const WelcomeSection = () => {
    const { user } = useAuth();
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400">
                Welcome Back, {user?.name || "Admin"} 👋
            </h1>

            <p className="mt-2 text-zinc-400 font-medium text-sm">
                Here's what's happening with your car rental fleet today.
            </p>
        </div>
    );
};

export default WelcomeSection;