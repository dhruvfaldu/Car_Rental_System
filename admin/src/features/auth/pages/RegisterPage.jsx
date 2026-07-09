import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validation/registerSchema";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Lock, Mail, User, Phone, Car } from "lucide-react";
import { Navigate, Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const { register: registerAdmin, isRegistering, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
        },
    });

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const onSubmit = async (data) => {
        try {
            await registerAdmin(data);
            navigate("/login");
        } catch (error) {
            // Handled by react query error notifier
        }
    };

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

                {/* Glassmorphic Register Card */}
                <div className="backdrop-blur-xl bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl shadow-black/50">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-zinc-100">Create Admin Account</h2>
                        <p className="text-zinc-400 text-xs mt-1">Register a new administrator profile.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wide text-zinc-300 block">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                                    <User className="h-5 w-5" />
                                </span>
                                <Input
                                    type="text"
                                    placeholder="Dhruv Faldu"
                                    className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-sky-500 focus:border-sky-500 rounded-lg transition-all duration-200"
                                    {...register("name")}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wide text-zinc-300 block">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                                    <Mail className="h-5 w-5" />
                                </span>
                                <Input
                                    type="email"
                                    placeholder="admin@carrental.com"
                                    className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-sky-500 focus:border-sky-500 rounded-lg transition-all duration-200"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wide text-zinc-300 block">Phone Number (Optional)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                                    <Phone className="h-5 w-5" />
                                </span>
                                <Input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-sky-500 focus:border-sky-500 rounded-lg transition-all duration-200"
                                    {...register("phone")}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wide text-zinc-300 block">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                                    <Lock className="h-5 w-5" />
                                </span>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-sky-500 focus:border-sky-500 rounded-lg transition-all duration-200"
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5 text-zinc-400" /> : <Eye className="h-5 w-5 text-zinc-400" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isRegistering}
                            className="w-full h-11 mt-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-sky-500/20 active:scale-[0.98] transition-all duration-200"
                        >
                            {isRegistering ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                                </span>
                            ) : (
                                "Sign Up as Admin"
                            )}
                        </Button>
                    </form>
                    
                    <div className="mt-6 text-center text-sm">
                        <span className="text-zinc-400">Already have an account? </span>
                        <Link to="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-zinc-600 mt-8">&copy; {new Date().getFullYear()} RevDrive Inc. All rights reserved.</p>
            </div>
        </div>
    );
}
