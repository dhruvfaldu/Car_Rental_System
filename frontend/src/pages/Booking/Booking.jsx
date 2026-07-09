import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
    ShieldCheck,
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

    const createBookingMutation = useCreateBooking();

    // Query for car data using React Query
    const { data: carData, isLoading: loading, error: carError } = useQuery({
        queryKey: ["car", carId],
        queryFn: async () => {
            const res = await getCarById(carId);
            return res.data;
        },
        enabled: !!carId,
    });

    const car = carData;

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
        if (carError) {
            toast.error("Failed to load car details. Returning home.");
            navigate("/");
        }
    }, [carError, navigate]);

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

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-950 text-zinc-100">
                <Loader2 size={44} className="animate-spin text-sky-500" />
                <p className="text-zinc-400 font-medium animate-pulse">Loading secure checkout...</p>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-zinc-950 text-zinc-100">
                <AlertCircle size={44} className="text-rose-500" />
                <p className="text-lg font-semibold">Vehicle info not found.</p>
                <Button onClick={() => navigate("/cars")} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">Back to Cars</Button>
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
            toast.success("Reservation created successfully!");
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
        <main className="bg-zinc-950 text-white-100 min-h-screen py-8 md:py-12 animate-fade-in">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link to={`/cars/${car.slug}`} className="inline-flex items-center text-sm font-semibold text-zinc-400 hover:text-zinc-200 mb-2 group transition-colors">
                            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Car Details
                        </Link>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
                            Book Your Ride
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Complete your booking details and reserve your luxury vehicle.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-xs font-semibold text-sky-400 shadow-sm shrink-0 self-start md:self-auto">
                        <ShieldCheck size={14} className="text-sky-400" />
                        <span>Best Rate Guaranteed</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-zinc-800 text-white overflow-hidden bg-zinc-900/20 backdrop-blur-md">
                                <div className="bg-gradient-to-r from-zinc-900 to-indigo-950 border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                                        <CalendarDays size={18} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-zinc-100 text-base">Rental Specifications</h2>
                                        <p className="text-xs text-zinc-400">Pick the dates and pickup location details</p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="pickupDate" className="text-zinc-350 text-xs font-semibold uppercase tracking-wider">Pickup Date</Label>
                                            <Input
                                                id="pickupDate"
                                                type="date"
                                                min={today}
                                                {...register("pickupDate")}
                                                className={`bg-zinc-950 border-zinc-800 text-zinc-150 h-11 cursor-pointer focus:border-zinc-755 ${errors.pickupDate ? "border-rose-500 focus:border-rose-500" : ""}`}
                                            />
                                            {errors.pickupDate && (
                                                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                                                    <AlertCircle size={12} /> {errors.pickupDate.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="returnDate" className="text-zinc-350 text-xs font-semibold uppercase tracking-wider">Return Date</Label>
                                            <Input
                                                id="returnDate"
                                                type="date"
                                                min={pickupDate || today}
                                                {...register("returnDate")}
                                                className={`bg-zinc-950 border-zinc-800 text-zinc-150 h-11 cursor-pointer focus:border-zinc-755 ${errors.returnDate ? "border-rose-500 focus:border-rose-500" : ""}`}
                                            />
                                            {errors.returnDate && (
                                                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                                                    <AlertCircle size={12} /> {errors.returnDate.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="pickupLocation" className="text-zinc-350 text-xs font-semibold uppercase tracking-wider">Pickup Location</Label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                                <Input
                                                    id="pickupLocation"
                                                    placeholder="Enter city, airport or office address"
                                                    className={`bg-zinc-950 border-zinc-800 text-zinc-150 h-11 pl-9 focus:border-zinc-755 ${errors.pickupLocation ? "border-rose-500 focus:border-rose-500" : ""}`}
                                                    {...register("pickupLocation")}
                                                />
                                            </div>
                                            {errors.pickupLocation && (
                                                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                                                    <AlertCircle size={12} /> {errors.pickupLocation.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="dropLocation" className="text-zinc-350 text-xs font-semibold uppercase tracking-wider">Drop Location</Label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                                <Input
                                                    id="dropLocation"
                                                    placeholder="Enter destination location"
                                                    className={`bg-zinc-950 border-zinc-800 text-zinc-150 h-11 pl-9 focus:border-zinc-755 ${errors.dropLocation ? "border-rose-500 focus:border-rose-500" : ""}`}
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

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <Card className="border-zinc-800 p-6 bg-zinc-900/20 backdrop-blur-md space-y-4">
                                <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                                        <CreditCard size={16} />
                                    </div>
                                    <h2 className="font-bold text-zinc-200 text-base">Select Payment Gateway</h2>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    {paymentOptions.map(({ value, label, icon: Icon, desc }) => {
                                        const isSelected = selectedPayment === value;
                                        return (
                                            <label
                                                key={value}
                                                className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 cursor-pointer transition-all duration-300 select-none
                                                    ${isSelected
                                                        ? "border-sky-500 bg-sky-500/5 shadow-md shadow-sky-500/5"
                                                        : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={value}
                                                    className="sr-only"
                                                    {...register("paymentMethod")}
                                                />
                                                <div className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300
                                                    ${isSelected ? "bg-sky-500 text-zinc-950 scale-110 font-bold" : "bg-zinc-850 text-zinc-400"}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="text-center">
                                                    <p className={`text-sm font-semibold transition-colors duration-250 ${isSelected ? "text-sky-400" : "text-zinc-200"}`}>
                                                        {label}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-500 mt-1">{desc}</p>
                                                </div>
                                                {isSelected && (
                                                    <span className="absolute top-2.5 right-2.5 h-4.5 w-4.5 rounded-full bg-sky-500 flex items-center justify-center border-2 border-zinc-900 shadow-sm">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <Card className="border-zinc-800 p-6 bg-zinc-900/20 backdrop-blur-md space-y-4">
                                <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                                        <FileText size={16} />
                                    </div>
                                    <h2 className="font-bold text-zinc-200 text-base">Additional Instructions</h2>
                                </div>
                                <Textarea
                                    rows={4}
                                    placeholder="Type any instructions, pickup delays, special luggage requirements, etc."
                                    className="bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-700 text-zinc-150 transition-colors resize-none"
                                    {...register("notes")}
                                />
                            </Card>
                        </motion.div>
                    </div>

                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                            className="sticky top-24"
                        >
                            <Card className="border-zinc-800 overflow-hidden bg-zinc-900/20 backdrop-blur-md">
                                <div className="relative h-56 overflow-hidden bg-slate-100">
                                    <img
                                        src={car.images?.[0]?.secure_url || fallbackImage}
                                        alt={car.name}
                                        className="w-full h-full object-contain p-2 opacity-95 transition-transform duration-500 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/10 to-transparent" />
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <span className="inline-block px-2.5 py-0.5 rounded bg-sky-500/90 text-zinc-950 text-[10px] font-bold uppercase tracking-wider mb-2">
                                            {car.brand?.name || "Premium Fleet"}
                                        </span>
                                        <h3 className="text-xl font-bold text-zinc-100">{car.name}</h3>
                                        <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                                            ⭐ 4.9 (42 reviews)
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">
                                    <h4 className="font-bold text-xs text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
                                        Financial Summary
                                    </h4>

                                    <div className="space-y-3 text-sm text-zinc-300">
                                        <div className="flex justify-between items-center">
                                            <span>Price Per Day</span>
                                            <span className="font-semibold text-zinc-150">
                                                ₹{car.pricePerDay?.toLocaleString() || "0"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span>Total Days Selected</span>
                                            <span className="font-semibold text-zinc-150">
                                                {summary.totalDays > 0 ? `${summary.totalDays} day${summary.totalDays > 1 ? "s" : ""}` : "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-zinc-150">
                                                {summary.subtotal > 0 ? `₹${summary.subtotal.toLocaleString()}` : "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span>Goods & Services Tax (18%)</span>
                                            <span className="font-semibold text-zinc-150">
                                                {summary.tax > 0 ? `₹${summary.tax.toFixed(2)}` : "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span>Refundable Security Deposit</span>
                                            <span className="font-semibold text-zinc-150">
                                                ₹{(car.securityDeposit || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 flex justify-between items-center">
                                        <div>
                                            <span className="font-bold text-zinc-200 text-sm">Grand Total</span>
                                            <p className="text-[10px] text-zinc-500 mt-0.5">All taxes included</p>
                                        </div>
                                        <span className="text-2xl font-black text-zinc-100">
                                            {summary.total > 0 ? `₹${summary.total.toFixed(2)}` : "—"}
                                        </span>
                                    </div>

                                    <Button
                                        disabled={createBookingMutation.isPending}
                                        onClick={handleSubmit(onSubmit)}
                                        className="w-full h-12 gap-2 text-sm font-bold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-lg shadow-lg hover:shadow-sky-500/10 active:scale-[0.98] transition-all"
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

                                    <div className="text-center text-[10px] text-zinc-500 pt-1 flex items-center justify-center gap-1">
                                        <ShieldCheck size={12} className="text-emerald-500" />
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