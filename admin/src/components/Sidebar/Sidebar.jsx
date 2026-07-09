import { Link, useLocation } from "react-router-dom";
import {
    Car,
    LayoutDashboard,
    Award,
    CalendarDays,
    Users,
    FileText,
    LogOut,
} from "lucide-react";
import { useLogout } from "@/features/auth/hook/useLogout";
import { useSelector } from "react-redux";

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useLogout();
    const { user } = useSelector((state) => state.auth);

    const navItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/",
        },
        {
            name: "Brands",
            icon: Award,
            path: "/brand",
        },
        {
            name: "Cars",
            icon: Car,
            path: "/cars",
            disabled: true,
        },
        {
            name: "Bookings",
            icon: CalendarDays,
            path: "/bookings",
            disabled: true,
        },
        {
            name: "Users",
            icon: Users,
            path: "/users",
            disabled: true,
        },
        {
            name: "Invoices",
            icon: FileText,
            path: "/invoices",
            disabled: true,
        },
    ];

    return (
        <aside className="w-64 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between shrink-0 select-none">
            {/* Upper Portion */}
            <div className="flex flex-col overflow-y-auto">
                {/* Logo Section */}
                <div className="h-16 flex items-center px-6 border-b border-zinc-900">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-lg">
                            <Car className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
                            RevDrive Admin
                        </span>
                    </Link>
                </div>

                {/* Nav Links */}
                <nav className="p-4 space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        if (item.disabled) {
                            return (
                                <div
                                    key={item.name}
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-600 cursor-not-allowed select-none text-sm font-medium"
                                    title="Coming soon"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                    <span className="ml-auto text-[10px] bg-zinc-900 text-zinc-600 px-1.5 py-0.5 rounded font-normal uppercase tracking-wider">
                                        Soon
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-gradient-to-r from-sky-500/10 to-indigo-500/5 text-sky-400 border border-sky-500/20"
                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent"
                                }`}
                            >
                                <Icon className={`h-4 w-4 ${isActive ? "text-sky-400" : "text-zinc-400"}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Portion / User Profile & Logout */}
            <div className="p-4 border-t border-zinc-900 bg-zinc-950/50 space-y-4">
                {user && (
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-sm text-white border border-zinc-800">
                            {user.name ? user.name[0].toUpperCase() : "A"}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-zinc-200 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}
                
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
