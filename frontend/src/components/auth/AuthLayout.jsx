import { CarFront } from "lucide-react";
import { Link } from "react-router-dom";

import authBg from "@/assets/auth-bg.png";

export default function AuthLayout({
    title,
    subtitle,
    children,
}) {
    return (
        <section className="min-h-screen bg-muted">
            <div className="grid h-screen lg:grid-cols-2">
                {/* Left Side */}
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

                {/* Right Side */}
                <div className="flex h-screen flex-col items-center justify-center bg-card overflow-y-auto px-4 py-8">
                    <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
                        {/* Mobile Logo */}
                        <div className="mb-8 flex justify-center lg:hidden">
                            <Link
                                to="/"
                                className="flex items-center gap-3"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                                    <CarFront className="text-white" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        CarRental
                                    </h2>

                                    <p className="text-sm text-muted-foreground">
                                        Drive Your Dream
                                    </p>
                                </div>
                            </Link>
                        </div>

                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold">
                                {title}
                            </h2>

                            <p className="mt-2 text-muted-foreground">
                                {subtitle}
                            </p>
                        </div>

                        {/* Form */}
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}