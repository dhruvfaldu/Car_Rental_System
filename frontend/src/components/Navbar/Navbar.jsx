import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    CarFront,
    Home,
    Car,
    BookOpen,
    Menu,
    LogOut,
    User,
    LayoutDashboard,
    ChevronDown,
    X,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLogoutMutation } from "@/features/auth/useAuthQuery";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Home", path: "/", icon: Home, exact: true },
    { name: "Cars", path: "/cars", icon: Car },
    { name: "My Bookings", path: "/my-bookings", icon: BookOpen, authOnly: true },
];

export default function Navbar() {
    const { mutate: logoutUser, isPending } = useLogoutMutation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close user menu on outside click
    useEffect(() => {
        const close = () => setUserMenuOpen(false);
        if (userMenuOpen) document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [userMenuOpen]);

    const visibleLinks = navLinks.filter(
        (link) => !link.authOnly || isAuthenticated
    );

    const initials = user?.name
        ? user.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()
        : "U";

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                scrolled
                    ? "bg-white/95 backdrop-blur-xl shadow-md shadow-slate-100/80 border-b border-slate-200/80"
                    : "bg-white/80 backdrop-blur-lg border-b border-slate-200/60"
            }`}
        >
            <div className="container mx-auto px-4 max-w-7xl">
                <nav className="flex h-18 items-center justify-between gap-4 py-3">
                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all duration-300 group-hover:shadow-indigo-300 group-hover:scale-105">
                            <CarFront size={20} />
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
                        </div>
                        <div>
                            <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                                CarRental
                                <span className="text-indigo-600">.</span>
                            </span>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-0.5">
                                Premium Fleet
                            </p>
                        </div>
                    </Link>

                    {/* ── Desktop Nav Links ── */}
                    <ul className="hidden lg:flex items-center gap-1">
                        {visibleLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        end={item.exact}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                                isActive
                                                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                            }`
                                        }
                                    >
                                        <Icon size={16} />
                                        {item.name}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>

                    {/* ── Desktop Actions ── */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                {/* Book a Car CTA */}
                                <Button
                                    asChild
                                    size="sm"
                                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 font-bold shadow-sm shadow-indigo-200"
                                >
                                    <Link to="/cars">
                                        <Sparkles size={14} className="mr-1.5" />
                                        Book a Car
                                    </Link>
                                </Button>

                                {/* User Avatar Dropdown */}
                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => setUserMenuOpen((p) => !p)}
                                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 transition-all shadow-sm"
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                                            {initials}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                                            {user?.name?.split(" ")[0] || "Account"}
                                        </span>
                                        <ChevronDown
                                            size={14}
                                            className={`text-slate-400 transition-transform duration-200 ${
                                                userMenuOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100 z-50 overflow-hidden"
                                            >
                                                {/* Header */}
                                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                                    <p className="text-sm font-bold text-slate-800 truncate">
                                                        {user?.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400 truncate">
                                                        {user?.email}
                                                    </p>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="p-2">
                                                    <Link
                                                        to="/dashboard/profile"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                                    >
                                                        <User size={15} />
                                                        My Profile
                                                    </Link>
                                                    <Link
                                                        to="/dashboard"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                                    >
                                                        <LayoutDashboard size={15} />
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        to="/my-bookings"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                                    >
                                                        <BookOpen size={15} />
                                                        My Bookings
                                                    </Link>
                                                </div>

                                                {/* Logout */}
                                                <div className="p-2 pt-0 border-t border-slate-100">
                                                    <button
                                                        onClick={() => {
                                                            setUserMenuOpen(false);
                                                            logoutUser();
                                                        }}
                                                        disabled={isPending}
                                                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                                                    >
                                                        <LogOut size={15} />
                                                        {isPending ? "Signing Out..." : "Sign Out"}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl text-slate-600 font-semibold hover:text-slate-900 hover:bg-slate-100"
                                >
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 font-bold shadow-sm shadow-indigo-200"
                                >
                                    <Link to="/register">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* ── Mobile Menu Toggle ── */}
                    <div className="lg:hidden">
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-10 w-10 rounded-xl border border-slate-200 text-slate-600"
                                >
                                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="right" className="w-[300px] p-0 flex flex-col">
                                {/* Mobile Sheet Header */}
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-sm">
                                        <CarFront size={18} />
                                    </div>
                                    <div>
                                        <span className="font-extrabold text-slate-900">
                                            CarRental<span className="text-indigo-600">.</span>
                                        </span>
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                                            Premium Fleet
                                        </p>
                                    </div>
                                </div>

                                {/* User Info in Mobile */}
                                {isAuthenticated && user && (
                                    <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl bg-indigo-50 border border-indigo-100 px-4 py-3">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                            {initials}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-slate-800 truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-slate-400 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Mobile Nav Links */}
                                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                                    {visibleLinks.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                end={item.exact}
                                                onClick={() => setMobileOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                                        isActive
                                                            ? "bg-indigo-600 text-white shadow-sm"
                                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                    }`
                                                }
                                            >
                                                <Icon size={18} />
                                                {item.name}
                                            </NavLink>
                                        );
                                    })}

                                    {isAuthenticated && (
                                        <>
                                            <NavLink
                                                to="/dashboard"
                                                onClick={() => setMobileOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                                        isActive
                                                            ? "bg-indigo-600 text-white"
                                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                    }`
                                                }
                                            >
                                                <LayoutDashboard size={18} />
                                                Dashboard
                                            </NavLink>
                                            <NavLink
                                                to="/dashboard/profile"
                                                onClick={() => setMobileOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                                        isActive
                                                            ? "bg-indigo-600 text-white"
                                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                    }`
                                                }
                                            >
                                                <User size={18} />
                                                My Profile
                                            </NavLink>
                                        </>
                                    )}
                                </div>

                                {/* Mobile Bottom Buttons */}
                                <div className="px-4 pb-6 pt-2 border-t border-slate-100 space-y-2.5">
                                    {isAuthenticated ? (
                                        <>
                                            <Button
                                                asChild
                                                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                <Link to="/cars">
                                                    <Sparkles size={15} className="mr-2" />
                                                    Book a Car
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-semibold"
                                                onClick={() => {
                                                    setMobileOpen(false);
                                                    logoutUser();
                                                }}
                                                disabled={isPending}
                                            >
                                                <LogOut size={15} className="mr-2" />
                                                {isPending ? "Signing Out..." : "Sign Out"}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="w-full rounded-xl border-slate-200 text-slate-700 font-semibold"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                <Link to="/login">Login</Link>
                                            </Button>
                                            <Button
                                                asChild
                                                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                <Link to="/register">Get Started</Link>
                                            </Button>
                                        </>
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