import { Link, NavLink } from "react-router-dom";
import {
    CarFront,
    Home,
    Car,
    BookOpen,
    Info,
    Phone,
    ArrowRight,
    Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useLogoutMutation } from "@/features/auth/useAuthQuery";

const navLinks = [
    {
        name: "Home",
        path: "/",
        icon: Home,
    },
    {
        name: "Cars",
        path: "/cars",
        icon: Car,
    },
    {
        name: "My Bookings",
        path: "/my-bookings",
        icon: BookOpen,
    },
    {
        name: "About",
        path: "/about",
        icon: Info,
    },
    {
        name: "Contact",
        path: "/contact",
        icon: Phone,
    },
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: ArrowRight,
    },
];

export default function Navbar() {

    const { mutate: logoutUser, isPending } = useLogoutMutation();

    return (
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
            <div className="container mx-auto px-4">
                <nav className="flex h-20 items-center justify-between">
                    {/* Logo */}

                    <Link
                        to="/"
                        className="flex items-center gap-3 group"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white transition group-hover:rotate-12">
                            <CarFront size={24} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold">
                                CarRental
                            </h1>

                            <p className="text-xs text-muted-foreground">
                                Premium Cars
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}

                    <ul className="hidden lg:flex items-center gap-2">
                        {navLinks.map((item) => {
                            const Icon = item.icon;

                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 rounded-lg px-4 py-2 transition
                      ${isActive
                                                ? "bg-primary text-white"
                                                : "hover:bg-muted"
                                            }`
                                        }
                                    >
                                        <Icon size={18} />

                                        {item.name}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Desktop Button */}

                    <div className="hidden lg:block">
                        <Button className="rounded-full px-6">
                            Book a Car

                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    {/* Mobile Menu */}

                    <div className="lg:hidden ">
                        <Sheet className="">
                            <SheetTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                >
                                    <Menu />
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="right" className="w-3/4 p-5">
                                <div className="mt-8 flex flex-col gap-3">
                                    {navLinks.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 rounded-lg px-4 py-3 transition
                          ${isActive
                                                        ? "bg-primary text-white"
                                                        : "hover:bg-muted"
                                                    }`
                                                }
                                            >
                                                <Icon size={20} />

                                                {item.name}
                                            </NavLink>
                                        );
                                    })}

                                    <Button
                                        className="mt-6 w-full"
                                        onClick={() => logoutUser()}
                                        disabled={isPending}
                                    >
                                        {isPending ? "Logging out..." : "Logout"}
                                    </Button>

                                    <Button className="mt-6 w-full">
                                        Book a Car

                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </nav>
            </div>
        </header>
    );
}