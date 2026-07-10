import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    CheckCircle2,
    Calendar,
    MapPin,
    CreditCard,
    Receipt,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    Home,
    FileText,
    Loader2
} from "lucide-react";
import { getBookingById } from "@/features/booking/bookingApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const fallbackImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

export default function BookingConfirmation() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    // Fetch booking details using React Query
    const { data: bookingData, isLoading, error } = useQuery({
        queryKey: ["booking", bookingId],
        queryFn: async () => {
            const res = await getBookingById(bookingId);
            return res.data;
        },
        enabled: !!bookingId,
    });

    const booking = bookingData;

    useEffect(() => {
        if (error) {
            toast.error("Failed to load booking details.");
        }
    }, [error]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                    <p className="text-zinc-400 font-medium animate-pulse">Fetching confirmation details...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
                <Card className="p-8 text-center max-w-md w-full border border-zinc-800 bg-zinc-900/30 rounded-2xl shadow-xl">
                    <FileText className="mx-auto text-rose-500 w-12 h-12 mb-4 animate-bounce" />
                    <h2 className="text-xl font-bold text-zinc-100">Booking Not Found</h2>
                    <p className="text-zinc-450 text-zinc-400 mt-2 text-sm">We couldn't locate the booking details you're looking for.</p>
                    <Button onClick={() => navigate("/")} className="mt-6 w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl">
                        Back to Home
                    </Button>
                </Card>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <main className="bg-zinc-950 text-zinc-100 min-h-screen py-12">
            <div className="container mx-auto max-w-6xl px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="p-8 md:p-10 mb-10 text-center bg-zinc-900/20 backdrop-blur-md border border-zinc-800 shadow-2xl rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500" />
                        
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                            className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-inner"
                        >
                            <CheckCircle2 className="text-emerald-450 text-emerald-450 w-9 h-9 text-emerald-400" />
                        </motion.div>

                        <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight mt-6">
                            Booking Submitted!
                        </h1>

                        <p className="text-zinc-400 mt-2 max-w-md mx-auto text-sm">
                            {booking.paymentMethod === "Cash"
                                ? "Your reservation is pending admin approval. You can pay physically in cash at pickup."
                                : "Your booking is confirmed! We have received your payment."}
                        </p>

                        <div className="mt-8 inline-flex items-center gap-3 bg-zinc-950/80 border border-zinc-850 border-zinc-800 rounded-full px-5 py-2">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Booking Number</span>
                            <div className="w-1.5 h-1.5 bg-emerald-450 bg-emerald-400 rounded-full" />
                            <span className="font-mono font-bold text-zinc-200 text-sm">
                                {booking.bookingNumber}
                            </span>
                        </div>
                    </Card>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="p-6 md:p-8 bg-zinc-900/25 border border-zinc-800 shadow-xl rounded-3xl space-y-8">
                                <div>
                                    <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                                        <Sparkles className="text-sky-400 w-5 h-5" />
                                        Reservation Summary
                                    </h2>
                                    <p className="text-zinc-500 text-xs mt-0.5">Please review your rental and pickup specifications below.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <InfoItem
                                        icon={<Calendar size={20} />}
                                        label="Pickup Date"
                                        value={formatDate(booking.pickupDate)}
                                    />

                                    <InfoItem
                                        icon={<Calendar size={20} />}
                                        label="Return Date"
                                        value={formatDate(booking.returnDate)}
                                    />

                                    <InfoItem
                                        icon={<MapPin size={20} />}
                                        label="Pickup Point"
                                        value={booking.pickupLocation}
                                    />

                                    <InfoItem
                                        icon={<MapPin size={20} />}
                                        label="Return Point"
                                        value={booking.dropLocation}
                                    />

                                    <InfoItem
                                        icon={<CreditCard size={20} />}
                                        label="Payment Method"
                                        value={`${booking.paymentMethod} Payment`}
                                    />

                                    <InfoItem
                                        icon={<Receipt size={20} />}
                                        label="Booking Status"
                                        value={booking.bookingStatus}
                                        isStatus
                                    />
                                </div>

                                {booking.notes && (
                                    <div className="p-4 bg-zinc-950/40 border border-zinc-850 border-zinc-800 rounded-2xl">
                                        <span className="text-xs font-bold text-zinc-500 block mb-1">Your Special Notes</span>
                                        <p className="text-zinc-350 text-zinc-300 text-sm italic">"{booking.notes}"</p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    </div>

                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="overflow-hidden border border-zinc-800 bg-zinc-900/25 rounded-3xl shadow-xl">
                                <div className="relative h-48 overflow-hidden bg-zinc-950">
                                    <img
                                        src={booking.car?.images?.[0]?.secure_url || fallbackImage}
                                        alt={booking.car?.name}
                                        className="h-full w-full object-contain p-2"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-5 right-5 text-white flex justify-between items-end">
                                        <div>
                                            <span className="px-2 py-0.5 text-[9px] font-bold bg-sky-500 text-zinc-950 rounded-full uppercase tracking-wider">
                                                {booking.car?.brand?.name || "Premium"}
                                            </span>
                                            <h3 className="text-lg font-bold mt-1 leading-tight">
                                                {booking.car?.name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-zinc-900/40 border-t border-zinc-800 space-y-6 relative">
                                    <div className="pt-2">
                                        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider text-center">Payment Details</h3>
                                        <p className="text-zinc-500 text-xs text-center mt-0.5">Itemized billing invoice breakdown</p>
                                    </div>

                                    <div className="space-y-3 font-mono text-xs text-zinc-350 text-zinc-300">
                                        <RowItem label="Days Counted" value={booking.totalDays} />
                                        <RowItem label="Subtotal Amount" value={`₹${booking.subtotal.toLocaleString()}`} />
                                        <RowItem label="Service Tax (18%)" value={`₹${booking.tax.toLocaleString()}`} />
                                        <RowItem label="Security Deposit" value={`₹${booking.securityDeposit.toLocaleString()}`} />
                                        <hr className="border-dashed border-zinc-800" />
                                        <RowItem label="Grand Total" value={`₹${booking.totalAmount.toLocaleString()}`} bold />
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-zinc-850 border-zinc-800">
                                        <Button
                                            onClick={() => navigate("/dashboard/bookings")}
                                            className="w-full h-11 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10 active:scale-[0.99] transition-transform"
                                        >
                                            Go To My Bookings
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => navigate("/")}
                                            className="w-full h-11 border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-semibold rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <Home className="w-4 h-4" />
                                            Back to Home
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-[10px] pt-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>Secure transaction receipt</span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function RowItem({ label, value, bold }) {
    return (
        <div className="flex justify-between">
            <span>{label}</span>
            <span className={bold ? "font-bold text-zinc-100 text-sm" : "font-semibold text-zinc-250"}>
                {value}
            </span>
        </div>
    );
}

function InfoItem({ icon, label, value, isStatus }) {
    const getStatusStyle = (status) => {
        const check = (status || "").toLowerCase();
        if (check === "completed" || check === "confirmed") {
            return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        }
        if (check === "pending") {
            return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        }
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    };

    return (
        <div className="flex gap-4 p-4 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl transition-colors bg-zinc-900/30">
            <div className="text-sky-455 text-sky-400 bg-sky-500/10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-sky-500/20">
                {icon}
            </div>
            <div className="space-y-0.5">
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                    {label}
                </p>
                {isStatus ? (
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusStyle(value)}`}>
                        {value}
                    </span>
                ) : (
                    <p className="font-bold text-zinc-200 text-sm">
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}