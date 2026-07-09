import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
    Car,
    FileText
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

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await getBookingById(bookingId);
                setBooking(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load booking details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Fetching confirmation details...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <Card className="p-8 text-center max-w-md w-full border border-slate-200 rounded-3xl shadow-xl">
                    <FileText className="mx-auto text-red-500 w-16 h-16 mb-4 animate-bounce" />
                    <h2 className="text-2xl font-bold text-slate-800">Booking Not Found</h2>
                    <p className="text-slate-500 mt-2">We couldn't locate the booking details you're looking for.</p>
                    <Button onClick={() => navigate("/")} className="mt-6 w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                        Back to Home
                    </Button>
                </Card>
            </div>
        );
    }

    // Format date nicely
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <main className="bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/20 min-h-screen py-12">
            <div className="container mx-auto max-w-6xl px-4">
                
                {/* Success Banner Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="p-8 md:p-10 mb-10 text-center bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-100/50 rounded-3xl relative overflow-hidden">
                        {/* Decorative Top Gradient Line */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500" />
                        
                        {/* Checkmark Animation */}
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                            className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-inner"
                        >
                            <CheckCircle2 className="text-emerald-500 w-12 h-12" />
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-6">
                            Booking Confirmed Successfully!
                        </h1>

                        <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm md:text-base">
                            Your reservation is secure. We've sent the details and invoice to your registered email address.
                        </p>

                        <div className="mt-8 inline-flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-full px-5 py-2.5 shadow-sm">
                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Booking Number</span>
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            <span className="font-mono font-bold text-slate-800 text-sm">
                                {booking.bookingNumber}
                            </span>
                        </div>
                    </Card>
                </motion.div>

                {/* Details Section */}
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Left: Booking Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="p-6 md:p-8 bg-white border border-slate-200/80 shadow-xl rounded-3xl space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <Sparkles className="text-indigo-600 w-5 h-5" />
                                        Reservation Summary
                                    </h2>
                                    <p className="text-slate-500 text-xs mt-0.5">Please review your rental and pickup specifications below.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <InfoItem
                                        icon={<Calendar size={20} />}
                                        label="Pickup Date & Time"
                                        value={formatDate(booking.pickupDate)}
                                    />

                                    <InfoItem
                                        icon={<Calendar size={20} />}
                                        label="Return Date & Time"
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
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <span className="text-xs font-bold text-slate-500 block mb-1">Your Special Notes</span>
                                        <p className="text-slate-600 text-sm italic">"{booking.notes}"</p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right: Invoice Receipt */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="overflow-hidden border border-slate-200 bg-white rounded-3xl shadow-xl">
                                {/* Car Quick view banner */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={booking.car?.images?.[0]?.secure_url || fallbackImage}
                                        alt={booking.car?.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-5 right-5 text-white flex justify-between items-end">
                                        <div>
                                            <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded-full uppercase tracking-wider">
                                                {booking.car?.brand?.name || "Premium"}
                                            </span>
                                            <h3 className="text-lg font-bold mt-1 leading-tight">
                                                {booking.car?.name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Styled Paper Receipt section */}
                                <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-6 relative">
                                    {/* Monospace edge effect indicators */}
                                    <div className="absolute -top-1.5 left-0 right-0 flex justify-between px-2 overflow-hidden pointer-events-none">
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <div key={i} className="w-2 h-2 bg-white rounded-full border border-slate-100" />
                                        ))}
                                    </div>

                                    <div className="pt-2">
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-center">Payment Details</h3>
                                        <p className="text-slate-400 text-xs text-center mt-0.5">Itemized billing invoice breakdown</p>
                                    </div>

                                    <div className="space-y-3 font-mono text-sm text-slate-600">
                                        <RowItem label="Days Counted" value={booking.totalDays} />
                                        <RowItem label="Subtotal Amount" value={`₹${booking.subtotal.toLocaleString()}`} />
                                        <RowItem label="Service Tax (18%)" value={`₹${booking.tax.toLocaleString()}`} />
                                        <RowItem label="Security Deposit" value={`₹${booking.securityDeposit.toLocaleString()}`} />
                                        <hr className="border-dashed border-slate-300" />
                                        <RowItem label="Grand Total Paid" value={`₹${booking.totalAmount.toLocaleString()}`} bold />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3 pt-4 border-t border-slate-200">
                                        <Button
                                            onClick={() => navigate("/dashboard/bookings")}
                                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 active:scale-[0.99] transition-transform"
                                        >
                                            View My Bookings
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => navigate("/")}
                                            className="w-full h-11 border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <Home className="w-4 h-4" />
                                            Back to Home
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] pt-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
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
            <span className={bold ? "font-bold text-slate-900 text-base" : "font-semibold text-slate-800"}>
                {value}
            </span>
        </div>
    );
}

function InfoItem({ icon, label, value, isStatus }) {
    // Generate status color badge
    const getStatusStyle = (status) => {
        const check = (status || "").toLowerCase();
        if (check === "completed" || check === "confirmed") {
            return "bg-emerald-100 text-emerald-800 border-emerald-200";
        }
        if (check === "pending") {
            return "bg-amber-100 text-amber-800 border-amber-200";
        }
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
    };

    return (
        <div className="flex gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl transition-colors bg-slate-50/50">
            <div className="text-indigo-600 bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100/50">
                {icon}
            </div>
            <div className="space-y-0.5">
                <p className="text-xs text-slate-400 font-medium">
                    {label}
                </p>
                {isStatus ? (
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusStyle(value)}`}>
                        {value}
                    </span>
                ) : (
                    <p className="font-bold text-slate-800 text-sm md:text-base">
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}