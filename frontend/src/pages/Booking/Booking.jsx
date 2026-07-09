import { useParams, useNavigate, Link } from "react-router-dom";
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
    ChevronLeft,
    Shield,
    HelpCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCarById } from "@/features/booking/bookingApi";
import { useCreateBooking } from "@/features/booking/useBookingMutation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "@/schemas/bookingSchema";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const fallbackImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

const today = new Date().toISOString().split("T")[0];

export default function Booking() {
    const { carId } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);

    const createBookingMutation = useCreateBooking();

    const {
        register,
        watch,
        handleSubmit,
        setValue,
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
                toast.error("Failed to load car details. Returning home.");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [carId, navigate]);

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

    // Format minimum return date dynamic to pickup date
    const getMinReturnDate = () => {
        if (!pickupDate) {
            return new Date().toISOString().split("T")[0];
        }
        const nextDay = new Date(pickupDate);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString().split("T")[0];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
                <Loader2 size={44} className="animate-spin text-indigo-600" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading secure checkout...</p>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
                <AlertCircle size={44} className="text-rose-500" />
                <p className="text-lg font-semibold">Vehicle info not found.</p>
                <Button onClick={() => navigate("/cars")}>Back to Cars</Button>
            </div>
        );
    }

    const onSubmit = async (values) => {
        const loadingToast = toast.loading("Reserving your vehicle...");
        try {
            const payload = {
                car: car._id,
                pickupDate: values.pickupDate,
                returnDate: values.returnDate,
                pickupLocation: values.pickupLocation,
                dropLocation: values.dropLocation,
                paymentMethod: values.paymentMethod,
                notes: values.notes,
            };

            const res = await createBookingMutation.mutateAsync(payload);
            toast.dismiss(loadingToast);
            toast.success("Reservation created! Redirecting to confirmation.");
            navigate(`/booking/${res.data._id}/confirmation`);
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error(error);
            toast.error(
                error.response?.data?.message || "Unable to reserve vehicle. Please check inputs."
            );
        }
    };

    const paymentOptions = [
        {
            value: "Online",
            label: "Online Payment",
            icon: Wifi,
            desc: "UPI, Net Banking, Card, Wallet",
        },
        {
            value: "Card",
            label: "Card Payment",
            icon: CreditCard,
            desc: "Visa, Mastercard, RuPay",
        },
        {
            value: "Cash",
            label: "Cash Payment",
            icon: Banknote,
            desc: "Pay on physical pickup",
        },
    ];

    return (
        <main className="bg-slate-50/50 min-h-screen py-8 md:py-12">
            <div className="container mx-auto max-w-7xl px-4">

                {/* Back button and page header */}
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link to={`/cars/${car.slug}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-2 group transition-colors">
                            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Car Details
                        </Link>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Book Your Ride
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Complete your booking details and reserve your luxury vehicle.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-xs font-semibold text-emerald-600 shadow-sm shrink-0 self-start md:self-auto">
                        <Shield size={14} />
                        <span>Best Rate Guaranteed</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left: Input Booking Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-slate-200/80 shadow-md shadow-slate-100/50 overflow-hidden bg-white">
                                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <CalendarDays size={18} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-white text-base">Rental Specifications</h2>
                                        <p className="text-xs text-indigo-200/70">Pick the dates and pickup location details</p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        {/* Pickup Date */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="pickupDate" className="text-slate-700 font-medium">Pickup Date</Label>
                                            <div className="relative">
                                                <Input
                                                    id="pickupDate"
                                                    type="date"
                                                    min={today}
                                                    {...register("pickupDate")}
                                                    className={`cursor-pointer hover:border-slate-400 transition-colors ${errors.pickupDate ? "border-rose-400 ring-rose-100" : ""}`}
                                                />
                                            </div>
                                            {errors.pickupDate && (
                                                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                                                    <AlertCircle size={12} /> {errors.pickupDate.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Return Date */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="returnDate" className="text-slate-700 font-medium">Return Date</Label>
                                            <div className="relative">
                                                <Input
                                                    id="returnDate"
                                                    type="date"
                                                    min={pickupDate || today}
                                                    {...register("returnDate")}
                                                    className={`cursor-pointer hover:border-slate-400 transition-colors ${errors.returnDate ? "border-rose-400 ring-rose-100" : ""}`}
                                                />
                                            </div>
                                            {errors.returnDate && (
                                                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                                                    <AlertCircle size={12} /> {errors.returnDate.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Pickup Location */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="pickupLocation" className="text-slate-700 font-medium">Pickup Location</Label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="pickupLocation"
                                                    placeholder="Enter city, airport or office address"
                                                    className={`pl-9 hover:border-slate-400 transition-colors ${errors.pickupLocation ? "border-rose-400 ring-rose-100" : ""}`}
                                                    {...register("pickupLocation")}
                                                />
                                            </div>
                                            {errors.pickupLocation && (
                                                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                                                    <AlertCircle size={12} /> {errors.pickupLocation.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Drop Location */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="dropLocation" className="text-slate-700 font-medium">Drop Location</Label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="dropLocation"
                                                    placeholder="Enter destination location"
                                                    className={`pl-9 hover:border-slate-400 transition-colors ${errors.dropLocation ? "border-rose-400 ring-rose-100" : ""}`}
                                                    {...register("dropLocation")}
                                                />
                                            </div>
                                            {errors.dropLocation && (
                                                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                                                    <AlertCircle size={12} /> {errors.dropLocation.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Payment Method Selector */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <Card className="border-slate-200/80 shadow-md shadow-slate-100/50 p-6 bg-white space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <CreditCard size={16} />
                                    </div>
                                    <h2 className="font-bold text-slate-900 text-base">Select Payment Gateway</h2>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    {paymentOptions.map(({ value, label, icon: Icon, desc }) => {
                                        const isSelected = selectedPayment === value;
                                        return (
                                            <label
                                                key={value}
                                                className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 cursor-pointer transition-all duration-300 select-none
                                                    ${isSelected
                                                        ? "border-indigo-600 bg-indigo-50/20 shadow-md shadow-indigo-100/40"
                                                        : "border-slate-200 hover:border-slate-350 hover:bg-slate-50/50"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={value}
                                                    className="sr-only"
                                                    {...register("paymentMethod")}
                                                />
                                                <div className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300
                                                    ${isSelected ? "bg-indigo-600 text-white scale-110" : "bg-slate-100 text-slate-550"}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="text-center">
                                                    <p className={`text-sm font-semibold transition-colors duration-250 ${isSelected ? "text-indigo-600" : "text-slate-800"}`}>
                                                        {label}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
                                                </div>
                                                {isSelected && (
                                                    <span className="absolute top-2.5 right-2.5 h-4.5 w-4.5 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-white shadow-sm">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </Card>
                        </motion.div>

                        {/* Additional Instructions */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <Card className="border-slate-200/80 shadow-md shadow-slate-100/50 p-6 bg-white space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <FileText size={16} />
                                    </div>
                                    <h2 className="font-bold text-slate-900 text-base">Additional Instructions</h2>
                                </div>
                                <Textarea
                                    rows={4}
                                    placeholder="Type any instructions, pickup delays, special luggage requirements, etc."
                                    className="focus-visible:ring-indigo-550 border-slate-200 hover:border-slate-350 transition-colors"
                                    {...register("notes")}
                                />
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right: Booking Vehicle Summary */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                            className="sticky top-24"
                        >
                            <Card className="border-slate-200/80 shadow-lg shadow-slate-150/40 overflow-hidden bg-white">
                                <div className="relative h-56 overflow-hidden bg-slate-900">
                                    <img
                                        src={car.images?.[0]?.secure_url || fallbackImage}
                                        alt={car.name}
                                        className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <span className="inline-block px-2.5 py-0.5 rounded bg-indigo-600/90 text-[10px] font-semibold uppercase tracking-wider mb-2">
                                            {car.brand?.name || "Premium Fleet"}
                                        </span>
                                        <h3 className="text-xl font-bold">{car.name}</h3>
                                        <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                                            <span>⭐ 4.9 (42 reviews)</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">
                                    <h4 className="font-bold text-xs text-slate-500 uppercase tracking-widest border-b pb-2">
                                        Financial Summary
                                    </h4>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center text-slate-650">
                                            <span>Price Per Day</span>
                                            <span className="font-semibold text-slate-900">
                                                ₹{car.pricePerDay?.toLocaleString() || "0"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-slate-650">
                                            <span>Total Days Selected</span>
                                            <span className="font-semibold text-slate-900">
                                                {summary.totalDays > 0 ? `${summary.totalDays} day${summary.totalDays > 1 ? "s" : ""}` : "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-slate-650">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-slate-900">
                                                {summary.subtotal > 0 ? `₹${summary.subtotal.toLocaleString()}` : "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-slate-650">
                                            <span>Goods & Services Tax (18%)</span>
                                            <span className="font-semibold text-slate-900">
                                                {summary.tax > 0 ? `₹${summary.tax.toFixed(2)}` : "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-slate-650">
                                            <span>Refundable Security Deposit</span>
                                            <span className="font-semibold text-slate-900">
                                                ₹{(car.securityDeposit || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-4 flex justify-between items-center">
                                        <div>
                                            <span className="font-bold text-slate-800 text-sm">Grand Total</span>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">All taxes included</p>
                                        </div>
                                        <span className="text-2xl font-black text-slate-900">
                                            {summary.total > 0 ? `₹${summary.total.toFixed(2)}` : "—"}
                                        </span>
                                    </div>

                                    <Button
                                        disabled={createBookingMutation.isPending}
                                        onClick={handleSubmit(onSubmit)}
                                        className="w-full h-12 gap-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md shadow-indigo-150 transition-all duration-200"
                                    >
                                        {createBookingMutation.isPending ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Processing Booking...
                                            </>
                                        ) : (
                                            <>
                                                Confirm & Continue
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </Button>

                                    <div className="text-center text-xs text-muted-foreground pt-1 flex items-center justify-center gap-1">
                                        <Shield size={12} className="text-emerald-500" />
                                        <span>Secure 256-bit encrypted checkout</span>
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