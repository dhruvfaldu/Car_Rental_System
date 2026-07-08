import {
    CalendarDays,
    MapPin,
    CreditCard,
    Eye,
    Download,
    XCircle,
    Car as CarIcon,
    Clock,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const fallbackImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

const statusStyles = {
    Active:    "bg-green-100 text-green-700 border-green-200",
    Upcoming:  "bg-blue-100 text-blue-700 border-blue-200",
    Pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
    Completed: "bg-slate-100 text-slate-600 border-slate-200",
    Cancelled: "bg-red-100 text-red-700 border-red-200",
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
    // Use bookingStatus (not car.status) for the booking status
    const status = booking.bookingStatus ?? "Pending";
    const statusClass = statusStyles[status] ?? statusStyles.Pending;

    const carImage = booking.car?.images?.[0]?.secure_url || fallbackImage;
    const carName = booking.car?.name ?? "Unknown Car";
    const carBrand = booking.car?.brand?.name ?? "";

    const isCancellable = status !== "Completed" && status !== "Cancelled";

    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl group">
            <div className="flex flex-col lg:flex-row">

                {/* ── Car Image ── */}
                <div className="relative lg:w-64 overflow-hidden shrink-0">
                    <img
                        src={carImage}
                        alt={carName}
                        className="h-52 w-full object-cover lg:h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r" />

                    {/* status badge over the image */}
                    <span className={`absolute top-3 left-3 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                        {status}
                    </span>
                </div>

                {/* ── Content ── */}
                <div className="flex flex-1 flex-col justify-between p-5 lg:p-6">

                    {/* Header */}
                    <div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {carBrand}
                                </p>
                                <h2 className="text-xl font-bold leading-tight">{carName}</h2>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Booking # <span className="font-mono font-semibold">{booking.bookingNumber}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                                    {status}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                    {booking.paymentMethod ?? "—"}
                                </Badge>
                            </div>
                        </div>

                        {/* Details grid */}
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                            <DetailItem
                                icon={<MapPin className="h-4 w-4 text-primary" />}
                                label="Pickup"
                                value={booking.pickupLocation}
                            />

                            <DetailItem
                                icon={<CarIcon className="h-4 w-4 text-primary" />}
                                label="Drop"
                                value={booking.dropLocation}
                            />

                            <DetailItem
                                icon={<CalendarDays className="h-4 w-4 text-primary" />}
                                label="Rental Period"
                                value={
                                    <span>
                                        {formatDate(booking.pickupDate)}
                                        <span className="text-muted-foreground mx-1">→</span>
                                        {formatDate(booking.returnDate)}
                                    </span>
                                }
                            />

                            <DetailItem
                                icon={<CreditCard className="h-4 w-4 text-primary" />}
                                label="Total Amount"
                                value={
                                    <span className="text-lg font-bold text-primary">
                                        ₹{booking.totalAmount?.toLocaleString() ?? "—"}
                                    </span>
                                }
                            />

                        </div>
                    </div>

                    {/* Footer: Actions */}
                    <div className="mt-6 flex flex-wrap gap-2 border-t pt-4">
                        <Button size="sm" className="gap-1.5">
                            <Eye size={14} />
                            View Details
                        </Button>

                        <Button size="sm" variant="outline" className="gap-1.5">
                            <Download size={14} />
                            Invoice
                        </Button>

                        {isCancellable && (
                            <Button size="sm" variant="destructive" className="gap-1.5">
                                <XCircle size={14} />
                                Cancel Booking
                            </Button>
                        )}
                    </div>

                </div>
            </div>
        </Card>
    );
}

function DetailItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="font-medium text-sm mt-0.5 truncate">{value}</div>
            </div>
        </div>
    );
}