import { useLocation } from "react-router-dom";
import { Bell, Search, User, Menu } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";

const Header = ({ onToggleSidebar }) => {
    const location = useLocation();
    const { user } = useAuth();

    const getPageTitle = () => {
        switch (location.pathname) {
            case "/":
                return "Dashboard Overview";
            case "/brands":
                return "Brands Management";
            case "/categories":
                return "Categories Management";
            case "/features":
                return "Features Management";
            case "/cars":
                return "Fleet Management";
            case "/bookings":
                return "Reservations Management";
            default:
                return "RevDrive Admin";
        }
    };

    return (
        <header className="flex h-16 select-none items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-8">
            {/* Page Title & Mobile Menu */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="p-1.5 text-muted-foreground transition-colors hover:text-foreground md:hidden"
                    title="Toggle Sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                    {getPageTitle()}
                </h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
                {/* Search */}
                <div className="relative hidden lg:block">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        <Search className="h-4 w-4" />
                    </span>

                    <input
                        type="text"
                        placeholder="Search anything..."
                        disabled
                        className="w-60 rounded-lg border border-input bg-background py-1.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none transition-all"
                    />
                </div>

                {/* Notifications */}
                <button className="relative cursor-pointer p-1.5 text-muted-foreground transition-colors hover:text-foreground">
                    <Bell className="h-5 w-5" />

                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-background bg-primary" />
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-border" />

                {/* User */}
                {user && (
                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-foreground">
                                {user.name}
                            </p>

                            <p className="text-xs font-medium capitalize text-muted-foreground">
                                {user.role}
                            </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-primary shadow-sm">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
