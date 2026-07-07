import { NavLink, Outlet, Link } from "react-router-dom";
import { User, Calendar, FileText, Home } from "lucide-react";
import { useSelector } from "react-redux";

export default function DashboardLayout() {
    const { user } = useSelector((state) => state.auth);

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

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-card px-4 py-6 md:flex md:flex-col">
                <div className="mb-8 px-2">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                            Renter Portal
                        </span>
                    </Link>
                </div>

                {/* User Quick Info */}
                {user && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                            {user.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold truncate">{user.name}</span>
                            <span className="text-xs text-muted-foreground capitalize truncate">{user.role}</span>
                        </div>
                    </div>
                )}

                {/* Nav Links */}
                <nav className="flex-1 space-y-1">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`
                                }
                            >
                                <Icon className="h-4.5 w-4.5" />
                                <span>{link.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom Back Home link */}
                <div className="mt-auto border-t pt-4">
                    <Link
                        to="/"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                    >
                        <Home className="h-4.5 w-4.5" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex flex-1 flex-col md:pl-64">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:hidden">
                    <span className="text-lg font-bold tracking-tight">Renter Portal</span>
                    <div className="flex items-center gap-4">
                        <nav className="flex gap-2">
                            {sidebarLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <NavLink
                                        key={link.href}
                                        to={link.href}
                                        title={link.label}
                                        className={({ isActive }) =>
                                            `p-2 rounded-lg transition-all ${
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-muted"
                                            }`
                                        }
                                    >
                                        <Icon className="h-5 w-5" />
                                    </NavLink>
                                );
                            })}
                            <Link to="/" className="p-2 rounded-lg text-muted-foreground hover:bg-muted" title="Home">
                                <Home className="h-5 w-5" />
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* Dashboard Page Main Content */}
                <main className="flex-1 p-6 md:p-8">
                    <div className="mx-auto max-w-4xl bg-card rounded-xl border p-6 md:p-8 shadow-sm">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
