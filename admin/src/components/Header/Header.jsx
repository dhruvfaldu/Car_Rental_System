import { useLocation } from "react-router-dom";
import { Bell, Search, User } from "lucide-react";
import { useSelector } from "react-redux";

const Header = () => {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    // Dynamic Title based on route
    const getPageTitle = () => {
        switch (location.pathname) {
            case "/":
                return "Dashboard Overview";
            case "/brand":
                return "Brands Management";
            default:
                return "RevDrive Admin";
        }
    };

    return (
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/60 backdrop-blur-md flex items-center justify-between px-8 select-none">
            {/* Page Title */}
            <div>
                <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
                    {getPageTitle()}
                </h1>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-6">
                {/* Search Bar - Aesthetic only */}
                <div className="relative hidden md:block">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                        <Search className="h-4 w-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="pl-9 pr-4 py-1.5 bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 placeholder-zinc-500 rounded-lg outline-none focus:border-zinc-700 transition-all w-60"
                        disabled
                    />
                </div>

                {/* Notifications Button - Mock */}
                <button className="relative p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full border border-zinc-950" />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-zinc-800" />

                {/* Profile Card */}
                {user && (
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-zinc-200">
                                {user.name}
                            </p>
                            <p className="text-xs text-zinc-500 font-medium capitalize">
                                {user.role}
                            </p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-semibold text-sky-400 shadow-inner">
                            <User className="h-4 w-4 text-zinc-400" />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
