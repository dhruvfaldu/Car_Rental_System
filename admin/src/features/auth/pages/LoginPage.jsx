import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/loginSchema";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Lock, Mail, Car, CarFront } from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import authBg from "@/assets/auth-bg.png";

export default function LoginPage() {
    const { login, isLoggingIn, isAuthenticated, user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    if (isAuthenticated && user?.role === "admin") {
        return <Navigate to="/" replace />;
    }

    const onSubmit = async (data) => {
        await login(data);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background font-sans selection:bg-primary selection:text-primary-foreground">

            <div className="grid h-screen lg:grid-cols-2">
                <div className="sticky top-0 hidden lg:flex">
                    <img
                        src={authBg}
                        alt="Luxury Car"
                        className="h-full w-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-slate-900/40" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                                <CarFront className="h-6 w-6 text-white" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold">
                                    CarRental
                                </h2>

                                <p className="text-sm text-slate-300">
                                    Drive Your Dream
                                </p>
                            </div>
                        </Link>

                        {/* Bottom Text */}
                        <div className="max-w-lg">
                            <h1 className="mb-4 text-5xl font-bold leading-tight">
                                Premium Cars for Every Journey
                            </h1>

                            <p className="text-lg text-slate-300 leading-8">
                                Discover luxury, comfort, and reliability with
                                our premium fleet. Rent your perfect car in
                                just a few clicks.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Login Card Container */}
                <div className="flex h-screen flex-col items-center bg-card overflow-y-auto px-4 py-8">
                    <div className=" w-full max-w-md p-2 sm:p-4">
                        {/* Logo */}
                        <div className="mb-8 flex flex-col items-center space-y-3">
                            <div className="rounded-2xl bg-primary p-3 shadow-xl animate-bounce duration-[3000ms]">
                                <Car className="h-8 w-8 text-primary-foreground" />
                            </div>

                            <div className="text-center">
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                    RevDrive Portal
                                </h1>

                                <p className="mt-1 text-sm font-medium text-muted-foreground">
                                    Car Rental Administration
                                </p>
                            </div>
                        </div>

                        {/* Login Card */}
                        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-card-foreground">
                                    Welcome Back
                                </h2>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Sign in to manage fleet, bookings, and returns.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold tracking-wide text-foreground">
                                        Email Address
                                    </label>

                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                            <Mail className="h-5 w-5" />
                                        </span>

                                        <Input
                                            type="email"
                                            placeholder="admin@carrental.com"
                                            className="h-11 border-input bg-background pl-10"
                                            {...register("email")}
                                        />
                                    </div>

                                    {errors.email && (
                                        <p className="text-xs font-medium text-destructive">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold tracking-wide text-foreground">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                            <Lock className="h-5 w-5" />
                                        </span>

                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="h-11 border-input bg-background pl-10 pr-10"
                                            {...register("password")}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <p className="text-xs font-medium text-destructive">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    disabled={isLoggingIn}
                                    className="h-11 w-full bg-primary font-semibold text-primary-foreground hover:opacity-90"
                                >
                                    {isLoggingIn ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Authenticating...
                                        </span>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm">
                                <span className="text-muted-foreground">
                                    Need an account?{" "}
                                </span>

                                <Link
                                    to="/register"
                                    className="font-semibold text-primary hover:underline"
                                >
                                    Register Admin
                                </Link>
                            </div>
                        </div>

                        <p className="mt-8 text-center text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} RevDrive Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
