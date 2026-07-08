import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

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
} from "lucide-react";

import { getBookingById } from "@/features/booking/bookingApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fallbackImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

const statusColors = {
    Pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
    Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    Active:    "bg-green-100 text-green-700 border-green-200",
    Completed: "bg-slate-100 text-slate-600 border-slate-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200",
};

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
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
                <Loader2 size={40} className="animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Fetching your booking…</p>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
                <AlertCircle size={40} className="text-destructive" />
                <p className="text-lg font-semibold">Booking not found.</p>
                <Button asChild variant="outline">
                    <Link to="/">Go Home</Link>
                </Button>
            </div>
        );
    }

    const statusClass = statusColors[booking.bookingStatus] ?? "bg-slate-100 text-slate-600";

    return (
        <main className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto max-w-5xl px-4 space-y-8">

                {/* ── Success Banner ── */}
                <Card className="overflow-hidden">
                    {/* top gradient bar */}
                    <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />

                    <div className="px-8 py-10 text-center space-y-4">
                        {/* animated check */}
                        <div className="flex justify-center">
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
                                <CheckCircle2 size={44} className="text-green-600 animate-[scale-in_0.4s_ease-out]" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">
                                Booking Confirmed! 🎉
                            </h1>
                            <p className="text-muted-foreground mt-1.5">
                                Thank you for choosing CarRental. Your reservation is all set.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-5 py-2">
                            <Receipt size={14} className="text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Booking No:</span>
                            <span className="text-sm font-bold">{booking.bookingNumber}</span>
                            <span className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClass}`}>
                                {booking.bookingStatus}
                            </span>
                        </div>
                    </div>
                </Card>

                <div className="grid lg:grid-cols-5 gap-6">

                    {/* ── Left: Booking Details ── */}
                    <div className="lg:col-span-3 space-y-5">

                        <Card className="p-6">
                            <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
                                <BookOpen size={16} className="text-primary" />
                                Booking Information
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
                                    icon={<CreditCard size={16} />}
                                    label="Payment Method"
                                    value={booking.paymentMethod}
                                />
                                <InfoTile
                                    icon={<Car size={16} />}
                                    label="Duration"
                                    value={`${booking.totalDays} day${booking.totalDays !== 1 ? "s" : ""}`}
                                />
                            </div>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={() => navigate("/my-bookings")} className="gap-2">
                                <BookOpen size={15} />
                                View My Bookings
                            </Button>
                            <Button variant="outline" asChild className="gap-2">
                                <Link to="/">
                                    <Home size={15} />
                                    Back to Home
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={() => window.print()}
                            >
                                <Printer size={15} />
                                Print Receipt
                            </Button>
                        </div>
                    </div>

                    {/* ── Right: Car & Price Summary ── */}
                    <div className="lg:col-span-2">
                        <Card className="overflow-hidden sticky top-24">

                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={booking.car?.images?.[0]?.secure_url || fallbackImage}
                                    alt={booking.car?.name}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-4 text-white">
                                    <p className="text-xs opacity-75 uppercase tracking-wider">{booking.car?.brand?.name}</p>
                                    <h3 className="text-lg font-bold">{booking.car?.name}</h3>
                                </div>
                            </div>

                            <div className="p-5 space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Price Breakdown
                                </h4>

                                <div className="space-y-2 text-sm">
                                    <SummaryRow label="Days" value={booking.totalDays} />
                                    <SummaryRow label="Subtotal" value={`₹${booking.subtotal?.toLocaleString()}`} />
                                    <SummaryRow label="Tax (18%)" value={`₹${booking.tax?.toLocaleString()}`} />
                                    <SummaryRow label="Security Deposit" value={`₹${booking.securityDeposit?.toLocaleString()}`} />
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">Grand Total</span>
                                        <span className="text-xl font-extrabold text-primary">
                                            ₹{booking.totalAmount?.toLocaleString()}
                                        </span>
                                    </div>
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
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

function InfoTile({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-semibold text-sm mt-0.5 truncate">{value}</p>
            </div>
        </div>
    );
}