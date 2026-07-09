import React, { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { User, Calendar, FileText, ArrowLeft, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";

export default function DashboardLayout() {
    const { user } = useSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarLinks = [
        {
            label: "My Profile",
            href: "/dashboard/profile",
            icon: User,
        },
        {
            label: "My Bookings",
            href: "/dashboard/bookings",
            icon: Calendar,
        },
        {
            label: "Invoices",
            href: "/dashboard/invoices",
            icon: FileText,
        },
    ];

    const handleClose = () => setSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden relative">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 w-64 border-r border-zinc-800 bg-zinc-900/10 px-4 py-6 md:relative md:translate-x-0 md:z-auto ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } flex flex-col justify-between shrink-0`}>
                <div className="flex flex-col">
                    <div className="mb-8 px-2 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2" onClick={handleClose}>
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                                Renter Portal
                            </span>
                        </Link>
                        <button
                            onClick={handleClose}
                            className="p-1.5 text-zinc-400 hover:text-zinc-200 md:hidden focus:outline-none"
                            title="Close Sidebar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* User Quick Info */}
                    {user && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl bg-zinc-900/30 border border-zinc-800 p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20">
                                {user.name ? user.name[0].toUpperCase() : "U"}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold truncate text-zinc-200">{user.name}</span>
                                <span className="text-xs text-zinc-500 capitalize truncate">{user.role}</span>
                            </div>
                        </div>
                    )}

                    {/* Nav Links */}
                    <nav className="space-y-1.5">
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <NavLink
                                    key={link.href}
                                    to={link.href}
                                    onClick={handleClose}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                                            isActive
                                                ? "bg-zinc-800 text-zinc-100 border border-zinc-700 shadow"
                                                : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                                        }`
                                    }
                                >
                                    <Icon className="h-4.5 w-4.5" />
                                    <span>{link.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Back Home link */}
                <div className="mt-auto border-t border-zinc-800 pt-4">
                    <Link
                        to="/"
                        onClick={handleClose}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200 transition-all"
                    >
                        <ArrowLeft className="h-4.5 w-4.5" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </aside>

            {/* Backdrop overlay for mobile drawer */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
                    onClick={handleClose}
                />
            )}

            {/* Main Area */}
            <div className="flex flex-1 flex-col md:pl-0 h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900/10 px-4 md:hidden select-none">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors md:hidden focus:outline-none"
                            title="Toggle Menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Renter Portal</span>
                    </div>
                </header>

                {/* Dashboard Page Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950">
                    <div className="mx-auto max-w-4xl bg-zinc-900/20 backdrop-blur-md rounded-2xl border border-zinc-800 p-4 md:p-8 shadow-sm">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
