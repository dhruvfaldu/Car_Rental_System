import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    CheckCircle2,
    Calendar,
    MapPin,
    CreditCard,
    Receipt,
    Car,
    Loader2,
    AlertCircle,
    Home,
    BookOpen,
    Printer,
    ShieldCheck,
    Coins,
    Lock,
} from "lucide-react";
import { useBookingDetails } from "@/features/booking/useBookingMutation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { processRazorpayPayment } from "@/utils/razorpay";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const fallbackImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

const statusColors = {
    Pending:   "bg-amber-50 text-amber-700 border-amber-200",
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-255",
    Active:    "bg-indigo-50 text-indigo-755 border-indigo-200",
    Completed: "bg-slate-50 text-slate-600 border-slate-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function BookingConfirmation() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [paymentPending, setPaymentPending] = useState(false);

    // Using TanStack React Query for details & refetching
    const {
        data: bookingRes,
        isLoading,
        isError,
        refetch,
    } = useBookingDetails(bookingId);

    const booking = bookingRes?.data;

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
                <Loader2 size={44} className="animate-spin text-indigo-650" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading reservation status...</p>
            </div>
        );
    }

    if (isError || !booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
                <AlertCircle size={44} className="text-rose-500" />
                <p className="text-lg font-semibold text-slate-800">Booking details not found.</p>
                <Button asChild bg="indigo-600">
                    <Link to="/">Go Home</Link>
                </Button>
            </div>
        );
    }

    const statusClass = statusColors[booking.bookingStatus] ?? "bg-slate-100 text-slate-600";
    
    // Check if the booking needs online payment and isn't paid yet
    const needsPayment = 
        (booking.paymentMethod === "Online" || booking.paymentMethod === "Card") &&
        (!booking.payment || booking.payment.status !== "Paid") &&
        booking.bookingStatus !== "Cancelled";

    const triggerPayment = () => {
        if (!booking) return;
        processRazorpayPayment({
            bookingId: booking._id,
            amount: booking.totalAmount,
            user,
            onPending: (isPending) => setPaymentPending(isPending),
            onSuccess: (paymentData) => {
                refetch();
            },
            onError: () => {
                // error is already shown by helper
            }
        });
    };

    return (
        <main className="bg-slate-50/50 min-h-screen py-8 md:py-12">
            <div className="container mx-auto max-w-5xl px-4 space-y-8">
                
                {/* Status card banner */}
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="overflow-hidden border-slate-200/80 shadow-md bg-white">
                        {needsPayment ? (
                            <div className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
                        ) : (
                            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500" />
                        )}

                        <div className="px-6 py-8 md:px-8 text-center space-y-4">
                            <div className="flex justify-center">
                                {needsPayment ? (
                                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 ring-8 ring-amber-50">
                                        <Lock size={36} className="text-amber-600" />
                                    </div>
                                ) : (
                                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
                                        <CheckCircle2 size={44} className="text-emerald-600 animate-[bounce_0.6s_ease-out_1]" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                                    {needsPayment ? "Booking Created — Payment Awaiting" : "Booking Successfully Confirmed! 🎉"}
                                </h1>
                                <p className="text-muted-foreground text-sm mt-1.5 max-w-md mx-auto">
                                    {needsPayment 
                                        ? "Complete your payment securely below to guarantee your premium car reservation."
                                        : "Your reservation has been approved and logged. Safe travels!"}
                                </p>
                            </div>

                            <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border bg-slate-50 px-5 py-2">
                                <Receipt size={14} className="text-slate-400" />
                                <span className="text-xs text-slate-500 font-medium">Reservation Ref:</span>
                                <span className="text-xs font-mono font-bold text-slate-800">{booking.bookingNumber}</span>
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusClass}`}>
                                    {booking.bookingStatus}
                                </span>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Main 2-column layout */}
                <div className="grid lg:grid-cols-5 gap-8">
                    
                    {/* Left: Info Grid & payment options */}
                    <div className="lg:col-span-3 space-y-6">
                        <AnimatePresence mode="wait">
                            {needsPayment && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <Card className="p-6 border-amber-250 bg-amber-50/20 shadow-md shadow-amber-50/10 space-y-4">
                                        <div className="flex items-center gap-2.5 text-amber-800">
                                            <ShieldCheck size={20} />
                                            <h2 className="font-extrabold text-base">Security Deposit & Payment</h2>
                                        </div>
                                        
                                        <p className="text-xs text-slate-650 leading-relaxed">
                                            We support instantaneous checkout using Razorpay gateway. Ensure you have UPI credentials, bank details, or credit cards ready.
                                        </p>

                                        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-2 text-xs">
                                            <div className="flex justify-between font-semibold">
                                                <span>Awaiting Amount</span>
                                                <span className="text-amber-800 text-sm">₹{booking.totalAmount?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Payment Gateway</span>
                                                <span>Razorpay Secure Connect</span>
                                            </div>
                                        </div>

                                        <Button 
                                            disabled={paymentPending}
                                            onClick={triggerPayment}
                                            className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm gap-2 shadow-md shadow-amber-100"
                                        >
                                            {paymentPending ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Processing payment popup...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard size={16} />
                                                    Pay Securely Now
                                                </>
                                            )}
                                        </Button>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Card className="p-6 border-slate-200/80 shadow-md bg-white">
                            <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <BookOpen size={16} className="text-indigo-600" />
                                Booking Specifications
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <InfoTile
                                    icon={<Calendar size={16} />}
                                    label="Pickup Date"
                                    value={new Date(booking.pickupDate).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "long", year: "numeric",
                                    })}
                                />
                                <InfoTile
                                    icon={<Calendar size={16} />}
                                    label="Return Date"
                                    value={new Date(booking.returnDate).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "long", year: "numeric",
                                    })}
                                />
                                <InfoTile
                                    icon={<MapPin size={16} />}
                                    label="Pickup Location"
                                    value={booking.pickupLocation}
                                />
                                <InfoTile
                                    icon={<MapPin size={16} />}
                                    label="Drop Location"
                                    value={booking.dropLocation}
                                />
                                <InfoTile
                                    icon={<Coins size={16} />}
                                    label="Payment Mode"
                                    value={`${booking.paymentMethod} (${booking.payment?.status || "Unpaid"})`}
                                />
                                <InfoTile
                                    icon={<Car size={16} />}
                                    label="Rental Duration"
                                    value={`${booking.totalDays} day${booking.totalDays !== 1 ? "s" : ""}`}
                                />
                            </div>
                        </Card>

                        {/* Page Actions */}
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={() => navigate("/my-bookings")} className="bg-indigo-650 hover:bg-indigo-750 text-white font-semibold gap-2">
                                <BookOpen size={15} />
                                View All Bookings
                            </Button>
                            <Button variant="outline" asChild className="gap-2 border-slate-250 hover:bg-slate-50 transition-colors">
                                <Link to="/">
                                    <Home size={15} />
                                    Back to Home
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 border-slate-250 hover:bg-slate-50 transition-colors"
                                onClick={() => window.print()}
                            >
                                <Printer size={15} />
                                Print Details
                            </Button>
                        </div>
                    </div>

                    {/* Right: Car Summary + Pricing */}
                    <div className="lg:col-span-2">
                        <Card className="overflow-hidden border-slate-200/80 shadow-md bg-white sticky top-24">
                            <div className="relative h-44 overflow-hidden bg-slate-900">
                                <img
                                    src={booking.car?.images?.[0]?.secure_url || fallbackImage}
                                    alt={booking.car?.name}
                                    className="h-full w-full object-cover opacity-95"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="text-[10px] text-indigo-305 font-bold uppercase tracking-widest">{booking.car?.brand?.name}</p>
                                    <h3 className="text-lg font-bold">{booking.car?.name}</h3>
                                </div>
                            </div>

                            <div className="p-5 space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Price Summary
                                </h4>

                                <div className="space-y-2 text-xs text-slate-600">
                                    <SummaryRow label="Total Days" value={booking.totalDays} />
                                    <SummaryRow label="Base Rental Subtotal" value={`₹${booking.subtotal?.toLocaleString()}`} />
                                    <SummaryRow label="Goods & Services Tax" value={`₹${booking.tax?.toLocaleString()}`} />
                                    <SummaryRow label="Refundable Deposit" value={`₹${booking.securityDeposit?.toLocaleString()}`} />
                                </div>

                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-800 text-sm">Grand Total Paid/Due</span>
                                        <span className="text-xl font-black text-indigo-600">
                                            ₹{booking.totalAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                    {!needsPayment && booking.payment && (
                                        <p className="text-[10px] text-right text-emerald-600 font-semibold mt-1">
                                            Transaction Ref: {booking.payment.transactionId || "Offline Payment"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>

            </div>
        </main>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex justify-between">
            <span>{label}</span>
            <span className="font-semibold text-slate-900">{value}</span>
        </div>
    );
}

function InfoTile({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{label}</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5 truncate">{value}</p>
            </div>
        </div>
    );
}