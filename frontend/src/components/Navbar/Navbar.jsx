import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    CarFront,
    Home,
    Car,
    BookOpen,
    Menu,
    LogOut,
    User,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/features/auth/useAuthQuery";
import { useSelector } from "react-redux";

const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Cars", path: "/cars", icon: Car },
    { name: "My Bookings", path: "/my-bookings", icon: BookOpen },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Phone },
];

export default function Navbar() {
    const { mutate: logoutUser, isPending } = useLogoutMutation();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm transition-shadow">
            <div className="container mx-auto px-4">
                <nav className="flex h-16 items-center justify-between gap-4">

                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                            <CarFront size={22} />
                            {/* glow ring */}
                            <span className="absolute inset-0 rounded-xl ring-2 ring-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="leading-tight">
                            <span className="block text-lg font-extrabold tracking-tight">
                                Car<span className="text-primary">Rental</span>
                            </span>
                            <span className="block text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
                                Premium Fleet
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop Navigation ── */}
                    <ul className="hidden lg:flex items-center gap-1">
                        {navLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        end={item.path === "/"}
                                        className={({ isActive }) =>
                                            `relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                                            ${isActive
                                                ? "text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon size={16} />
                                                {item.name}
                                                {isActive && (
                                                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>

                    {/* ── Desktop Right Actions ── */}
                    <div className="hidden lg:flex items-center gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full gap-2"
                            asChild
                        >
                            <Link to="/cars">
                                Book a Car
                                <ArrowRight size={15} />
                            </Link>
                        </Button>

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase">
                                            {user?.name?.[0] ?? "U"}
                                        </div>
                                        <span className="max-w-[120px] truncate">{user?.name ?? "Account"}</span>
                                        <ChevronDown size={14} className="text-muted-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link to="/dashboard/profile" className="flex items-center gap-2">
                                            <User size={14} /> Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/my-bookings" className="flex items-center gap-2">
                                            <BookOpen size={14} /> My Bookings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive cursor-pointer"
                                        onClick={() => logoutUser()}
                                        disabled={isPending}
                                    >
                                        <LogOut size={14} className="mr-2" />
                                        {isPending ? "Logging out…" : "Logout"}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button size="sm" className="rounded-full px-5" asChild>
                                <Link to="/login">Sign In</Link>
                            </Button>
                        )}
                    </div>

                    {/* ── Mobile Menu ── */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button size="icon" variant="ghost" aria-label="Open menu">
                                    <Menu size={20} />
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="right" className="w-72 p-0">
                                {/* Mobile header */}
                                <div className="flex items-center gap-3 border-b px-5 py-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                        <CarFront size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">
                                            Car<span className="text-primary">Rental</span>
                                        </p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                            Premium Fleet
                                        </p>
                                    </div>
                                </div>

                                {/* User greeting */}
                                {isAuthenticated && (
                                    <div className="flex items-center gap-3 bg-muted/40 px-5 py-3 border-b">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase">
                                            {user?.name?.[0] ?? "U"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold truncate">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-1 px-3 py-4">
                                    {navLinks.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                end={item.path === "/"}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors
                                                    ${isActive
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                                    }`
                                                }
                                            >
                                                <Icon size={18} />
                                                {item.name}
                                            </NavLink>
                                        );
                                    })}
                                </div>

                                <div className="border-t px-4 py-4 space-y-2">
                                    <Button className="w-full" size="sm" asChild>
                                        <Link to="/cars">
                                            Book a Car
                                            <ArrowRight size={15} className="ml-2" />
                                        </Link>
                                    </Button>

                                    {isAuthenticated ? (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            size="sm"
                                            onClick={() => logoutUser()}
                                            disabled={isPending}
                                        >
                                            <LogOut size={15} className="mr-2" />
                                            {isPending ? "Logging out…" : "Logout"}
                                        </Button>
                                    ) : (
                                        <Button variant="outline" className="w-full" size="sm" asChild>
                                            <Link to="/login">Sign In</Link>
                                        </Button>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                </nav>
            </div>
        </header>
    );
}