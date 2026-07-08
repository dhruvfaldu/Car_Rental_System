import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    CalendarDays,
    MapPin,
    CreditCard,
    FileText,
    Banknote,
    Wifi,
    ArrowRight,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { createBooking } from "@/features/booking/bookingApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCarById } from "@/features/booking/bookingApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "@/schemas/bookingSchema";

const fallbackImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

const today = new Date().toISOString().split("T")[0];

export default function Booking() {
    const { carId } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState(null);

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            paymentMethod: "Online",
            notes: "",
        },
    });

    const pickupDate = watch("pickupDate");
    const returnDate = watch("returnDate");
    const selectedPayment = watch("paymentMethod");

    const [summary, setSummary] = useState({
        totalDays: 0,
        subtotal: 0,
        tax: 0,
        total: 0,
    });

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await getCarById(carId);
                setCar(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [carId]);

    useEffect(() => {
        if (!car || !pickupDate || !returnDate) {
            setSummary({ totalDays: 0, subtotal: 0, tax: 0, total: 0 });
            return;
        }

        const pickup = new Date(pickupDate);
        const drop = new Date(returnDate);
        const diff = Math.ceil((drop - pickup) / (1000 * 60 * 60 * 24));

        if (diff <= 0) {
            setSummary({ totalDays: 0, subtotal: 0, tax: 0, total: 0 });
            return;
        }

        const subtotal = diff * car.pricePerDay;
        const tax = subtotal * 0.18;
        const total = subtotal + tax + (car.securityDeposit || 0);

        setSummary({ totalDays: diff, subtotal, tax, total });
    }, [pickupDate, returnDate, car]);

    /* ──── Loading state ──── */
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
                <Loader2 size={40} className="animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Loading car details…</p>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
                <AlertCircle size={40} className="text-destructive" />
                <p className="text-lg font-semibold">Car not found.</p>
            </div>
        );
    }

    const onSubmit = async (values) => {
        try {
            setBookingLoading(true);
            setBookingError(null);

            const payload = {
                car: car._id,
                pickupDate: values.pickupDate,
                returnDate: values.returnDate,
                pickupLocation: values.pickupLocation,
                dropLocation: values.dropLocation,
                paymentMethod: values.paymentMethod,
                notes: values.notes,
            };

            const res = await createBooking(payload);
            navigate(`/booking/${res.data._id}/confirmation`);
        } catch (error) {
            console.error(error);
            setBookingError(
                error.response?.data?.message || "Unable to create booking."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    const paymentOptions = [
        {
            value: "Online",
            label: "Online Payment",
            icon: Wifi,
            desc: "UPI, Net Banking, Wallet",
        },
        {
            value: "Card",
            label: "Card Payment",
            icon: CreditCard,
            desc: "Debit / Credit card",
        },
        {
            value: "Cash",
            label: "Cash Payment",
            icon: Banknote,
            desc: "Pay at pickup",
        },
    ];

    return (
        <main className="bg-slate-50 min-h-screen py-10">
            <div className="container mx-auto max-w-7xl px-4">

                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Book Your Car</h1>
                    <p className="text-muted-foreground mt-1">
                        Fill in the details below to complete your reservation.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* ── Left: Form ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Rental Dates & Locations */}
                        <Card className="p-6 space-y-6">
                            <div className="flex items-center gap-2 border-b pb-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                    <CalendarDays size={16} className="text-primary" />
                                </div>
                                <h2 className="text-lg font-semibold">Rental Details</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">

                                {/* Pickup Date — min is always today */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="pickupDate">Pickup Date</Label>
                                    <Input
                                        id="pickupDate"
                                        type="date"
                                        min={today}
                                        {...register("pickupDate")}
                                        className="cursor-pointer"
                                    />
                                    {errors.pickupDate && (
                                        <p className="text-xs text-destructive flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.pickupDate.message}
                                        </p>
                                    )}
                                </div>

                                {/* Return Date — min is pickup date (or today) */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="returnDate">Return Date</Label>
                                    <Input
                                        id="returnDate"
                                        type="date"
                                        min={pickupDate || today}
                                        {...register("returnDate")}
                                        className="cursor-pointer"
                                    />
                                    {errors.returnDate && (
                                        <p className="text-xs text-destructive flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.returnDate.message}
                                        </p>
                                    )}
                                </div>

                                {/* Pickup Location */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                                    <div className="relative">
                                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="pickupLocation"
                                            placeholder="City or address"
                                            className="pl-9"
                                            {...register("pickupLocation")}
                                        />
                                    </div>
                                    {errors.pickupLocation && (
                                        <p className="text-xs text-destructive flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.pickupLocation.message}
                                        </p>
                                    )}
                                </div>

                                {/* Drop Location */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="dropLocation">Drop Location</Label>
                                    <div className="relative">
                                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="dropLocation"
                                            placeholder="City or address"
                                            className="pl-9"
                                            {...register("dropLocation")}
                                        />
                                    </div>
                                    {errors.dropLocation && (
                                        <p className="text-xs text-destructive flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.dropLocation.message}
                                        </p>
                                    )}
                                </div>

                            </div>
                        </Card>

                        {/* Payment Method */}
                        <Card className="p-6 space-y-4">
                            <div className="flex items-center gap-2 border-b pb-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                    <CreditCard size={16} className="text-primary" />
                                </div>
                                <h2 className="text-lg font-semibold">Payment Method</h2>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-3">
                                {paymentOptions.map(({ value, label, icon: Icon, desc }) => {
                                    const isSelected = selectedPayment === value;
                                    return (
                                        <label
                                            key={value}
                                            className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200
                                                ${isSelected
                                                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/20"
                                                    : "border-border hover:border-primary/50 hover:bg-muted/40"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                value={value}
                                                className="sr-only"
                                                {...register("paymentMethod")}
                                            />
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors
                                                ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div className="text-center">
                                                <p className={`text-sm font-semibold ${isSelected ? "text-primary" : ""}`}>
                                                    {label}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                                            </div>
                                            {isSelected && (
                                                <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Notes */}
                        <Card className="p-6 space-y-4">
                            <div className="flex items-center gap-2 border-b pb-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                    <FileText size={16} className="text-primary" />
                                </div>
                                <h2 className="text-lg font-semibold">Additional Notes</h2>
                            </div>
                            <Textarea
                                rows={4}
                                placeholder="Any special requests or instructions for pickup..."
                                {...register("notes")}
                            />
                        </Card>

                        {/* Error banner */}
                        {bookingError && (
                            <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                <AlertCircle size={16} />
                                {bookingError}
                            </div>
                        )}

                    </div>

                    {/* ── Right: Summary ── */}
                    <div>
                        <Card className="sticky top-24 overflow-hidden">

                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={car.images?.[0]?.secure_url || fallbackImage}
                                    alt={car.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-4 text-white">
                                    <p className="text-xs font-medium opacity-80 uppercase tracking-wider">
                                        {car.brand?.name}
                                    </p>
                                    <h3 className="text-xl font-bold">{car.name}</h3>
                                </div>
                            </div>

                            <div className="p-5 space-y-4">

                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                                    Price Summary
                                </h4>

                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Price / Day</span>
                                        <span className="font-medium">
                                            ₹{car.pricePerDay.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Days</span>
                                        <span className="font-medium">
                                            {summary.totalDays > 0 ? `${summary.totalDays} day${summary.totalDays > 1 ? "s" : ""}` : "—"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">
                                            {summary.subtotal > 0 ? `₹${summary.subtotal.toLocaleString()}` : "—"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax (18%)</span>
                                        <span className="font-medium">
                                            {summary.tax > 0 ? `₹${summary.tax.toFixed(2)}` : "—"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Security Deposit</span>
                                        <span className="font-medium">
                                            ₹{(car.securityDeposit || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 flex justify-between items-center">
                                    <span className="font-semibold">Total</span>
                                    <span className="text-xl font-bold text-primary">
                                        {summary.total > 0 ? `₹${summary.total.toFixed(2)}` : "—"}
                                    </span>
                                </div>

                                <Button
                                    disabled={bookingLoading}
                                    onClick={handleSubmit(onSubmit)}
                                    className="w-full h-11 gap-2"
                                >
                                    {bookingLoading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Creating Booking…
                                        </>
                                    ) : (
                                        <>
                                            Continue Booking
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </Button>

                                <p className="text-center text-xs text-muted-foreground">
                                    You can cancel free of charge before pickup
                                </p>

                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </main>
    );
}