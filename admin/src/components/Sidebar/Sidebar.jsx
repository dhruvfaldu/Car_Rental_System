import { Link, useLocation } from "react-router-dom";
import {
    Car,
    LayoutDashboard,
    Award,
    CalendarDays,
    Users,
    FileText,
    LogOut,
    Tags,
    SlidersHorizontal,
    X,
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";

const Sidebar = ({ onClose }) => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const navItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/",
        },
        {
            name: "Brands",
            icon: Award,
            path: "/brands",
        },
        {
            name: "Categories",
            icon: Tags,
            path: "/categories",
        },
        {
            name: "Features",
            icon: SlidersHorizontal,
            path: "/features",
        },
        {
            name: "Cars",
            icon: Car,
            path: "/cars",
        },
        {
            name: "Bookings",
            icon: CalendarDays,
            path: "/bookings",
        },
        {
            name: "Users",
            icon: Users,
            path: "/users",
        },
        {
            name: "Invoices",
            icon: FileText,
            path: "/invoices",
        },
    ];

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    return (
        <aside className="flex h-full w-64 shrink-0 select-none flex-col justify-between border-r border-sidebar-border bg-sidebar">
            {/* Top Section */}
            <div className="flex flex-col overflow-y-auto">
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
                    <Link
                        to="/"
                        className="flex items-center gap-3"
                        onClick={handleLinkClick}
                    >
                        <div className="rounded-lg bg-sidebar-primary p-2">
                            <Car className="h-5 w-5 text-sidebar-primary-foreground" />
                        </div>

                        <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
                            RevDrive Admin
                        </span>
                    </Link>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 text-muted-foreground transition-colors hover:text-foreground md:hidden"
                            title="Close Sidebar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="space-y-1.5 p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        if (item.disabled) {
                            return (
                                <div
                                    key={item.name}
                                    className="flex cursor-not-allowed select-none items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground opacity-50"
                                    title="Coming soon"
                                >
                                    <Icon className="h-4 w-4" />

                                    <span>{item.name}</span>

                                    <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                                        Soon
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={handleLinkClick}
                                className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    }`}
                            >
                                <Icon
                                    className={`h-4 w-4 ${isActive
                                        ? "text-sidebar-primary"
                                        : "text-muted-foreground"
                                        }`}
                                />

                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="space-y-4 border-t border-sidebar-border bg-sidebar p-4">
                {user && (
                    <div className="flex items-center gap-3 px-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary font-bold text-sm text-sidebar-primary-foreground">
                            {user.name ? user.name[0].toUpperCase() : "A"}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-sidebar-foreground">
                                {user.name}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                                {user.role}
                            </p>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => {
                        logout();
                        handleLinkClick();
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10 hover:border-destructive/20"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
