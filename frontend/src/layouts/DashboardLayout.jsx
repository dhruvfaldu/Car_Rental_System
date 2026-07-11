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
        <div className="relative flex min-h-screen overflow-hidden bg-background text-foreground">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 transform flex-col justify-between border-r border-sidebar-border bg-sidebar px-4 py-6 transition-transform duration-300 md:relative md:z-auto md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div>
                    {/* Logo */}
                    <div className="mb-8 flex items-center justify-between px-2">
                        <Link
                            to="/"
                            onClick={handleClose}
                            className="text-xl font-bold tracking-tight text-sidebar-foreground"
                        >
                            Renter Portal
                        </Link>

                        <button
                            onClick={handleClose}
                            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground md:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* User */}
                    {user && (
                        <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                                {user.name?.[0]?.toUpperCase() || "U"}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate font-medium text-card-foreground">
                                    {user.name}
                                </p>

                                <p className="truncate text-xs capitalize text-muted-foreground">
                                    {user.role}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="space-y-2">
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon;

                            return (
                                <NavLink
                                    key={link.href}
                                    to={link.href}
                                    onClick={handleClose}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${isActive
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`
                                    }
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{link.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom */}
                <div className="border-t border-border pt-4">
                    <Link
                        to="/"
                        onClick={handleClose}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    onClick={handleClose}
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
                />
            )}

            {/* Main */}
            <div className="flex h-screen flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="rounded-md p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <span className="text-lg font-bold text-foreground">
                            Renter Portal
                        </span>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
                    <div className="mx-auto rounded-xl border border-border bg-card p-4 shadow-sm md:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
