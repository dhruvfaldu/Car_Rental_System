import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
    CheckCircle2,
    Calendar,
    MapPin,
    Car,
    CreditCard,
    Receipt,
} from "lucide-react";

import { getBookingById } from "@/features/booking/bookingApi";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

            } finally {

                setLoading(false);

            }

        };

        fetchBooking();

    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading booking...
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Booking not found.
            </div>
        );
    }

    return (
        <main className="bg-slate-50 min-h-screen py-12">

            <div className="container mx-auto max-w-6xl px-4">

                <Card className="p-8 mb-8 text-center">

                    <CheckCircle2
                        className="mx-auto text-green-600"
                        size={70}
                    />

                    <h1 className="text-4xl font-bold mt-5">
                        Booking Created Successfully
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Thank you for booking with us.
                    </p>

                    <div className="mt-6 inline-flex rounded-full bg-green-100 px-5 py-2">

                        Booking No :

                        <span className="font-bold ml-2">

                            {booking.bookingNumber}

                        </span>

                    </div>

                </Card>

                <div className="grid lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2">

                        <Card className="p-6">

                            <h2 className="text-xl font-bold mb-6">

                                Booking Information

                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">

                                <Info
                                    icon={<Calendar size={18} />}
                                    label="Pickup Date"
                                    value={new Date(
                                        booking.pickupDate
                                    ).toLocaleDateString()}
                                />

                                <Info
                                    icon={<Calendar size={18} />}
                                    label="Return Date"
                                    value={new Date(
                                        booking.returnDate
                                    ).toLocaleDateString()}
                                />

                                <Info
                                    icon={<MapPin size={18} />}
                                    label="Pickup Location"
                                    value={booking.pickupLocation}
                                />

                                <Info
                                    icon={<MapPin size={18} />}
                                    label="Drop Location"
                                    value={booking.dropLocation}
                                />

                                <Info
                                    icon={<CreditCard size={18} />}
                                    label="Payment"
                                    value={booking.paymentMethod}
                                />

                                <Info
                                    icon={<Receipt size={18} />}
                                    label="Status"
                                    value={booking.bookingStatus}
                                />

                            </div>

                        </Card>

                    </div>

                    <div>

                        <Card className="overflow-hidden">

                            <img
                                src={
                                    booking.car?.images?.[0]?.secure_url ||
                                    fallbackImage
                                }
                                className="h-52 w-full object-cover"
                            />

                            <div className="p-6">

                                <h3 className="text-xl font-bold">

                                    {booking.car?.name}

                                </h3>

                                <div className="mt-6 space-y-3">

                                    <Row
                                        label="Days"
                                        value={booking.totalDays}
                                    />

                                    <Row
                                        label="Subtotal"
                                        value={`₹${booking.subtotal.toLocaleString()}`}
                                    />

                                    <Row
                                        label="Tax"
                                        value={`₹${booking.tax.toLocaleString()}`}
                                    />

                                    <Row
                                        label="Deposit"
                                        value={`₹${booking.securityDeposit.toLocaleString()}`}
                                    />

                                    <hr />

                                    <Row
                                        label="Grand Total"
                                        value={`₹${booking.totalAmount.toLocaleString()}`}
                                        bold
                                    />

                                </div>

                                <div className="space-y-3 mt-8">

                                    <Button
                                        className="w-full"
                                        onClick={() =>
                                            navigate("/dashboard/bookings")
                                        }
                                    >
                                        View My Bookings
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        asChild
                                    >
                                        <Link to="/">
                                            Back to Home
                                        </Link>
                                    </Button>

                                </div>

                            </div>

                        </Card>

                    </div>

                </div>

            </div>

        </main>
    );
}

function Row({ label, value, bold }) {

    return (
        <div className="flex justify-between">

            <span>{label}</span>

            <span className={bold ? "font-bold" : ""}>

                {value}

            </span>

        </div>
    );
}

function Info({ icon, label, value }) {

    return (
        <div className="flex gap-3">

            <div className="mt-1 text-primary">

                {icon}

            </div>

            <div>

                <p className="text-sm text-slate-500">

                    {label}

                </p>

                <p className="font-semibold">

                    {value}

                </p>

            </div>

        </div>
    );
}