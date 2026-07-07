import { Link } from "react-router-dom";
import {
    CarFront,
    MapPin,
    Phone,
    Mail,
    ArrowRight,
} from "lucide-react";

import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
    const quickLinks = [
        { name: "Home", path: "/" },
        { name: "Cars", path: "/cars" },
        { name: "My Bookings", path: "/my-bookings" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    const services = [
        "Luxury Cars",
        "SUV Rental",
        "Airport Transfer",
        "Business Rental",
        "Long Term Rental",
    ];

    const socials = [
        FaFacebookF,
        FaInstagram,
        FaTwitter,
        FaLinkedinIn,
    ];

    return (
        <footer className="mt-24 border-t border-slate-800 bg-slate-900 text-slate-300">
            <div className="container mx-auto px-6 py-16">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company */}
                    <div>
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                <CarFront size={24} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    CarRental
                                </h2>
                                <p className="text-sm text-slate-400">
                                    Drive Beyond Limits
                                </p>
                            </div>
                        </Link>

                        <p className="mt-5 leading-7 text-slate-400">
                            Premium car rental service offering luxury,
                            economy and SUV vehicles with affordable
                            pricing and 24/7 customer support.
                        </p>

                        <div className="mt-6 flex gap-3">
                            {socials.map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition-all duration-300 hover:bg-primary hover:scale-110"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="mb-5 text-lg font-semibold text-white">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-2 transition hover:text-primary"
                                    >
                                        <ArrowRight
                                            size={15}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="mb-5 text-lg font-semibold text-white">
                            Services
                        </h3>

                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li
                                    key={service}
                                    className="transition hover:text-primary cursor-pointer"
                                >
                                    {service}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-5 text-lg font-semibold text-white">
                            Contact
                        </h3>

                        <div className="space-y-5">
                            <div className="flex gap-3">
                                <MapPin className="text-primary" size={18} />
                                <span>Ahmedabad, Gujarat</span>
                            </div>

                            <div className="flex gap-3">
                                <Phone className="text-primary" size={18} />
                                <span>+91 98765 43210</span>
                            </div>

                            <div className="flex gap-3">
                                <Mail className="text-primary" size={18} />
                                <span>support@carrental.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-14 border-t border-slate-800 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm text-slate-400">
                    <p>
                        © {new Date().getFullYear()} CarRental. All rights reserved.
                    </p>

                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-primary">
                            Privacy Policy
                        </Link>

                        <Link to="/terms" className="hover:text-primary">
                            Terms
                        </Link>

                        <Link to="/cookies" className="hover:text-primary">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}