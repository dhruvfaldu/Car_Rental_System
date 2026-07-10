import { useState } from "react";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import {
    CalendarDays,
    MapPin,
    CreditCard,
    Eye,
    XCircle,
    Loader2,
    ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCancelBooking } from "@/features/booking/useBookingMutation";
import { processRazorpayPayment } from "@/utils/razorpay";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const fallbackImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

const statusStyles = {
    Active: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Completed: "bg-zinc-800/80 text-zinc-400 border-zinc-700/80",
    Cancelled: "bg-rose-500/10 text-rose-455 text-rose-400 border-rose-500/20",
};

const payStatusStyles = {
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Paid: "bg-emerald-500/10 text-emerald-450 text-emerald-400 border-emerald-500/20",
    Failed: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};


function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function BookingCard({ booking }) {
    const { user } = useSelector((state) => state.auth);
    const queryClient = useQueryClient();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [paymentPending, setPaymentPending] = useState(false);

    const cancelMutation = useCancelBooking();

    const status = booking.bookingStatus ?? "Pending";
    const statusClass = statusStyles[status] ?? statusStyles.Pending;

    const carImage = booking.car?.images?.[0]?.secure_url || fallbackImage;
    const carName = booking.car?.name ?? "Premium Vehicle";
    const carBrand = booking.car?.brand?.name ?? "CarRental";

    const isCancellable = status === "Pending" || status === "Confirmed";

    const paymentStatus = booking.payment?.status ?? "Pending";
    const isOnlinePayment = booking.paymentMethod === "Online" || booking.paymentMethod === "Card";
    const needsPayment = isOnlinePayment && paymentStatus !== "Paid" && status !== "Cancelled";

    const handleCancelSubmit = async (e) => {
        e.preventDefault();
        if (!cancelReason.trim()) {
            toast.error("Please enter a valid cancellation reason.");
            return;
        }

        const cancelToast = toast.loading("Cancelling reservation...");
        try {
            await cancelMutation.mutateAsync({
                bookingId: booking._id,
                cancelReason,
            });
            toast.dismiss(cancelToast);
            toast.success("Reservation cancelled successfully.");
            setShowCancelModal(false);
            setCancelReason("");
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        } catch (error) {
            toast.dismiss(cancelToast);
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to cancel booking. Please try again."
            );
        }
    };

    const handlePayNow = () => {
        processRazorpayPayment({
            bookingId: booking._id,
            amount: booking.totalAmount,
            user,
            onPending: (isPending) => setPaymentPending(isPending),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["bookings"] });
            },
        });
    };

    return (
        <>
            <Card className="group overflow-hidden border-border bg-card shadow-sm transition-all duration-300 hover:border-ring hover:shadow-lg">                <div className="flex flex-col lg:flex-row">

                <div className="relative flex shrink-0 items-center justify-center overflow-hidden bg-muted p-2 lg:w-64">
                    <img
                        src={carImage}
                        alt={carName}
                        className="h-52 w-full object-contain transition-transform duration-500 group-hover:scale-105 lg:h-full"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 lg:p-6 space-y-4">
                    <div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                    {carBrand}
                                </span>
                                <h2 className="mt-0.5 text-lg font-extrabold leading-tight text-foreground">
                                    {carName}
                                </h2>
                                <p className="mt-1.5 text-xs text-muted-foreground">
                                    Reference:
                                    <span className="ml-1 font-mono font-bold text-foreground">
                                        {booking.bookingNumber}
                                    </span>
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusClass}`}>
                                    {status}
                                </span>

                                <Badge variant="outline" className={`text-[10px] border px-2 py-0.5 font-bold ${needsPayment ? payStatusStyles.Pending : payStatusStyles.Paid}`}>
                                    {booking.paymentMethod} {needsPayment ? "• Unpaid" : "• Paid"}
                                </Badge>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-4">                            <DetailItem
                            icon={<MapPin className="h-4 w-4 text-primary" />}
                            label="Pickup Location"
                            value={booking.pickupLocation}
                        />
                            <DetailItem
                                icon={<MapPin className="h-4 w-4 text-primary" />}
                                label="Drop Location"
                                value={booking.dropLocation}
                            />
                            <DetailItem
                                icon={<CalendarDays className="h-4 w-4 text-primary" />}
                                label="Rental Duration"
                                value={
                                    <span className="text-xs font-semibold text-foreground">
                                        {formatDate(booking.pickupDate)}
                                        <span className="mx-1 text-muted-foreground">→</span>
                                        {formatDate(booking.returnDate)}
                                    </span>
                                }
                            />
                            <DetailItem
                                icon={<CreditCard className="h-4 w-4 text-primary" />}
                                label="Grand Total"
                                value={
                                    <span className="text-base font-extrabold text-primary">
                                        ₹{booking.totalAmount?.toLocaleString() ?? "—"}
                                    </span>
                                }
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                        <Button size="sm" variant="outline" className="bg-transparent" asChild>
                            <Link to={`/booking/${booking._id}/confirmation`}>
                                <Eye size={13} className="mr-1.5" />
                                View Receipt
                            </Link>
                        </Button>

                        {needsPayment && (
                            <Button
                                size="sm"
                                disabled={paymentPending}
                                onClick={handlePayNow}
                                className="gap-1.5 bg-primary font-semibold text-primary-foreground hover:opacity-90"
                            >
                                {paymentPending ? (
                                    <>
                                        <Loader2 size={13} className="animate-spin" />
                                        Launching...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={13} />
                                        Pay Now
                                    </>
                                )}
                            </Button>
                        )}

                        {isCancellable && (
                            <Button
                                size="sm"
                                variant="destructive"
                                className="gap-1.5 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => setShowCancelModal(true)}
                            >
                                <XCircle size={13} />
                                Cancel Booking
                            </Button>
                        )}
                    </div>

                </div>
            </div>
            </Card>

            <AnimatePresence>
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                        >
                            <div className="flex items-start gap-3 border-b border-destructive/20 bg-destructive/10 p-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                    <ShieldAlert size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">
                                        Cancel Car Reservation?
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        This action cannot be undone. Funds paid online will be credited back depending on merchant timelines.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleCancelSubmit} className="p-5 space-y-4">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="cancelReason"
                                        className="font-medium text-foreground"
                                    />
                                    <Input
                                        id="cancelReason"
                                        placeholder="Please explain why you need to cancel..."
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        required
                                        className="border-input bg-background focus-visible:ring-destructive"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowCancelModal(false);
                                            setCancelReason("");
                                        }}
                                    >
                                        Dismiss
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        disabled={cancelMutation.isPending}
                                    >
                                        {cancelMutation.isPending ? (
                                            <>
                                                <Loader2 size={13} className="mr-1.5 animate-spin" />
                                                Cancelling...
                                            </>
                                        ) : (
                                            "Confirm Cancel"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

function DetailItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0 text-primary">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {label}
                </p>

                <div className="mt-0.5 truncate text-xs font-semibold text-foreground">
                    {value}
                </div>
            </div>
        </div>
    );
}