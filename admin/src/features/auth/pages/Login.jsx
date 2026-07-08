import LoginForm from "../components/LoginForm";
import { Car } from "lucide-react";

const Login = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden font-sans selection:bg-sky-500 selection:text-white">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-[128px] pointer-events-none animate-pulse duration-[6000ms]" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] pointer-events-none animate-pulse duration-[8000ms]" />

            <div className="relative w-full max-w-md p-2 sm:p-4">
                {/* Brand Logo & Title */}
                <div className="flex flex-col items-center mb-8 space-y-3">
                    <div className="p-3 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-2xl shadow-xl shadow-sky-500/10 animate-bounce duration-[3000ms]">
                        <Car className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400">
                            RevDrive Portal
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1 font-medium">
                            Car Rental Administration
                        </p>
                    </div>
                </div>

                {/* Glassmorphic Login Card */}
                <div className="backdrop-blur-xl bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl shadow-black/50">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-zinc-100">
                            Welcome Back
                        </h2>
                        <p className="text-zinc-400 text-xs mt-1">
                            Sign in to manage fleet, bookings, and returns.
                        </p>
                    </div>

                    <LoginForm />
                </div>

                {/* Footer Credits */}
                <p className="text-center text-xs text-zinc-600 mt-8">
                    &copy; {new Date().getFullYear()} RevDrive Inc. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
