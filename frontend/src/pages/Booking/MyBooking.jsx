import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    MapPin,
    CreditCard,
    Clock,
    Car,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    ExternalLink,
    SlidersHorizontal,
    RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getMyBookings } from "@/features/booking/bookingApi";

const fallbackImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

const STATUS_OPTIONS = [
    { label: "All", value: "" },
    { label: "Pending", value: "Pending" },
    { label: "Confirmed", value: "Confirmed" },
    { label: "Picked Up", value: "Picked Up" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
];

function getStatusConfig(status) {
    switch ((status || "").toLowerCase()) {
        case "completed":
            return {
                color: "bg-emerald-50 border-emerald-200 text-emerald-700",
                icon: <CheckCircle2 size={13} />,
                dot: "bg-emerald-500",
            };
        case "confirmed":
            return {
                color: "bg-blue-50 border-blue-200 text-blue-700",
                icon: <CheckCircle2 size={13} />,
                dot: "bg-blue-500",
            };
        case "cancelled":
            return {
                color: "bg-red-50 border-red-200 text-red-700",
                icon: <XCircle size={13} />,
                dot: "bg-red-500",
            };
        case "picked up":
            return {
                color: "bg-violet-50 border-violet-200 text-violet-700",
                icon: <Car size={13} />,
                dot: "bg-violet-500",
            };
        default: // Pending
            return {
                color: "bg-amber-50 border-amber-200 text-amber-700",
                icon: <AlertCircle size={13} />,
                dot: "bg-amber-400",
            };
    }
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function BookingCard({ booking }) {
    const navigate = useNavigate();
    const statusConfig = getStatusConfig(booking.bookingStatus);
    const carImage = booking.car?.images?.[0]?.secure_url || fallbackImage;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="overflow-hidden border border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 group">
                <div className="flex flex-col sm:flex-row">
                    {/* Car Image */}
                    <div className="relative sm:w-48 h-40 sm:h-auto shrink-0 overflow-hidden bg-slate-100">
                        <img
                            src={carImage}
                            alt={booking.car?.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => (e.target.src = fallbackImage)}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-transparent sm:bg-gradient-to-t" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                        {/* Top: car info + status */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {booking.car?.brand?.name || "Vehicle"}
                                </span>
                                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                                    {booking.car?.name || "—"}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                                    #{booking.bookingNumber}
                                </p>
                            </div>

                            <Badge
                                className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 border rounded-full ${statusConfig.color}`}
                            >
                                <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                                {booking.bookingStatus}
                            </Badge>
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <InfoChip icon={<Calendar size={13} />} label="Pickup" value={formatDate(booking.pickupDate)} />
                            <InfoChip icon={<Calendar size={13} />} label="Return" value={formatDate(booking.returnDate)} />
                            <InfoChip icon={<MapPin size={13} />} label="From" value={booking.pickupLocation} />
                            <InfoChip icon={<CreditCard size={13} />} label="Payment" value={booking.paymentMethod} />
                        </div>

                        {/* Bottom: pricing + action */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-4 text-sm">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Duration
                                    </span>
                                    <span className="font-bold text-slate-700">
                                        {booking.totalDays} {booking.totalDays === 1 ? "Day" : "Days"}
                                    </span>
                                </div>
                                <div className="w-px h-8 bg-slate-200" />
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Total Amount
                                    </span>
                                    <span className="font-extrabold text-indigo-600 text-base font-mono">
                                        ₹{(booking.totalAmount || 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                className="rounded-xl px-4 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm text-xs flex items-center gap-1.5"
                                onClick={() =>
                                    navigate(`/booking/${booking._id}/confirmation`)
                                }
                            >
                                View Details
                                <ExternalLink size={13} />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

function InfoChip({ icon, label, value }) {
    return (
        <div className="flex items-start gap-1.5">
            <span className="text-indigo-400 mt-0.5 shrink-0">{icon}</span>
            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                </p>
                <p className="text-xs font-semibold text-slate-700 truncate">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}

function EmptyBookings({ onReset }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mb-6">
                <BookOpen size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Bookings Found</h3>
            <p className="text-slate-400 text-sm max-w-xs">
                You haven't made any bookings yet, or none match your current filters.
            </p>
            <Button
                onClick={onReset}
                variant="outline"
                className="mt-6 rounded-xl border-slate-200 text-slate-600 font-semibold"
            >
                <RefreshCw size={14} className="mr-2" />
                Clear Filters
            </Button>
        </div>
    );
}

export default function MyBooking() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const navigate = useNavigate();

    // Debounce search
    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        clearTimeout(window._searchTimeout);
        window._searchTimeout = setTimeout(() => {
            setDebouncedSearch(val);
            setPage(1);
        }, 400);
    };

    const queryParams = {
        page,
        limit: 6,
        ...(statusFilter ? { bookingStatus: statusFilter } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["myBookings", queryParams],
        queryFn: () => getMyBookings(queryParams),
    });

    const bookings = data?.data || [];
    const pagination = data?.meta?.pagination || data?.pagination || {};
    const totalPages = pagination.totalPages || 1;
    const totalRecords = pagination.totalRecords || bookings.length;

    const handleStatusChange = (val) => {
        setStatusFilter(val);
        setPage(1);
    };

    const handleReset = () => {
        setSearch("");
        setDebouncedSearch("");
        setStatusFilter("");
        setPage(1);
    };

    return (
        <main className="bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/20 min-h-screen py-12">
            <div className="container mx-auto max-w-5xl px-4">

                {/* ── Page Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1.5">
                        <BookOpen size={14} />
                        Booking History
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                My Bookings
                            </h1>
                            {!isLoading && (
                                <p className="text-slate-500 text-sm mt-1">
                                    {totalRecords > 0
                                        ? `${totalRecords} booking${totalRecords !== 1 ? "s" : ""} found`
                                        : "No bookings yet"}
                                </p>
                            )}
                        </div>
                        <Button
                            onClick={() => navigate("/cars")}
                            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm shrink-0"
                        >
                            <Car size={15} className="mr-2" />
                            Book New Car
                        </Button>
                    </div>
                </motion.div>

                {/* ── Filters ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    className="mb-8 space-y-4"
                >
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <Input
                            placeholder="Search by booking number..."
                            value={search}
                            onChange={handleSearchChange}
                            className="h-11 pl-10 bg-white border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                    </div>

                    {/* Status tabs */}
                    <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleStatusChange(opt.value)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                                    statusFilter === opt.value
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* ── Booking List ── */}
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-white border border-slate-200 rounded-2xl overflow-hidden flex h-40"
                            >
                                <div className="w-48 bg-slate-100" />
                                <div className="flex-1 p-5 space-y-3">
                                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                                    <div className="grid grid-cols-4 gap-3 pt-2">
                                        {Array.from({ length: 4 }).map((_, j) => (
                                            <div key={j} className="h-8 bg-slate-100 rounded-lg" />
                                        ))}
                                    </div>
                                    <div className="h-8 bg-slate-100 rounded-lg w-1/3 mt-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center py-24 text-center">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle size={32} className="text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            Failed to load bookings
                        </h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Something went wrong. Please try again.
                        </p>
                        <Button
                            onClick={() => refetch()}
                            variant="outline"
                            className="rounded-xl border-slate-200 font-semibold"
                        >
                            <RefreshCw size={14} className="mr-2" />
                            Retry
                        </Button>
                    </div>
                ) : bookings.length === 0 ? (
                    <EmptyBookings onReset={handleReset} />
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <BookingCard key={booking._id} booking={booking} />
                            ))}
                        </div>
                    </AnimatePresence>
                )}

                {/* ── Pagination ── */}
                {!isLoading && totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-10 flex items-center justify-center gap-2"
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-xl border-slate-200"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft size={16} />
                        </Button>

                        {Array.from({ length: totalPages }).map((_, i) => {
                            const p = i + 1;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`h-9 w-9 rounded-xl text-sm font-bold transition-all ${
                                        page === p
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                                    }`}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-xl border-slate-200"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </motion.div>
                )}

            </div>
        </main>
    );
}