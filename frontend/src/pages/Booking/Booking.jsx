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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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

    const [isPickupOpen, setIsPickupOpen] = useState(false);
    const [isReturnOpen, setIsReturnOpen] = useState(false);

    const isDateBooked = (date) => {
        if (!car?.bookedDates || car.bookedDates.length === 0) return false;
        const targetDate = startOfDay(date);
        return car.bookedDates.some((booking) => {
            const start = startOfDay(new Date(booking.pickupDate));
            const end = startOfDay(new Date(booking.returnDate));
            return targetDate >= start && targetDate <= end;
        });
    };

    const handlePickupSelect = (date) => {
        if (!date) return;
        const dateStr = format(date, "yyyy-MM-dd");
        setValue("pickupDate", dateStr, { shouldValidate: true });
        setIsPickupOpen(false);
    };

    const handleReturnSelect = (date) => {
        if (!date) return;
        const dateStr = format(date, "yyyy-MM-dd");
        setValue("returnDate", dateStr, { shouldValidate: true });
        setIsReturnOpen(false);
    };

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
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
                <Loader2 size={44} className="animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading secure checkout...</p>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-foreground">
                <AlertCircle size={44} className="text-rose-500" />
                <p className="text-lg font-semibold">Vehicle info not found.</p>
                <Button onClick={() => navigate("/cars")} className="bg-primary hover:bg-primary/90 text-primary-foreground">Back to Cars</Button>
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
        <main className="bg-background text-foreground min-h-screen py-8 md:py-12 animate-fade-in">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link to={`/cars/${car.slug}`} className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground mb-2 group transition-colors">
                            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Car Details
                        </Link>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Book Your Ride
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">
                            Complete your booking details and reserve your luxury vehicle.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-xs font-semibold text-foreground shadow-sm shrink-0 self-start md:self-auto">
                        <ShieldCheck size={14} className="text-muted-foreground" />
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
                            <Card className="border-border text-foreground overflow-hidden bg-card shadow-sm">
                                <div className="bg-muted border-b border-border px-6 py-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <CalendarDays size={18} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-foreground text-base">Rental Specifications</h2>
                                        <p className="text-xs text-muted-foreground">Pick the dates and pickup location details</p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="pickupDate" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Pickup Date</Label>
                                            <input type="hidden" {...register("pickupDate")} />
                                            <Popover open={isPickupOpen} onOpenChange={setIsPickupOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        type="button"
                                                        className={`w-full bg-background border-border text-foreground h-11 px-3 text-left font-normal flex items-center justify-between focus-visible:ring-ring hover:bg-muted/50 ${
                                                            errors.pickupDate ? "border-rose-500 focus:border-rose-500" : ""
                                                        }`}
                                                    >
                                                        <span>
                                                            {pickupDate ? format(parseISO(pickupDate), "dd-MM-yyyy") : "Select Date"}
                                                        </span>
                                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-popover border border-border text-popover-foreground" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={pickupDate ? parseISO(pickupDate) : undefined}
                                                        onSelect={handlePickupSelect}
                                                        disabled={(date) => {
                                                            const isPast = startOfDay(date) < startOfDay(new Date());
                                                            return isPast || isDateBooked(date);
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.pickupDate && (
                                                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                                                    <AlertCircle size={12} /> {errors.pickupDate.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="returnDate" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Return Date</Label>
                                            <input type="hidden" {...register("returnDate")} />
                                            <Popover open={isReturnOpen} onOpenChange={setIsReturnOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        type="button"
                                                        disabled={!pickupDate}
                                                        className={`w-full bg-background border-border text-foreground h-11 px-3 text-left font-normal flex items-center justify-between focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50 ${
                                                            errors.returnDate ? "border-rose-500 focus:border-rose-500" : ""
                                                        }`}
                                                    >
                                                        <span>
                                                            {returnDate ? format(parseISO(returnDate), "dd-MM-yyyy") : "Select Date"}
                                                        </span>
                                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-popover border border-border text-popover-foreground" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={returnDate ? parseISO(returnDate) : undefined}
                                                        onSelect={handleReturnSelect}
                                                        disabled={(date) => {
                                                            const limitDate = pickupDate ? parseISO(pickupDate) : new Date();
                                                            const isBeforePickup = startOfDay(date) < startOfDay(limitDate);
                                                            return isBeforePickup || isDateBooked(date);
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.returnDate && (
                                                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                                                    <AlertCircle size={12} /> {errors.returnDate.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="pickupLocation" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Pickup Location</Label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="pickupLocation"
                                                    placeholder="Enter city, airport or office address"
                                                    className={`bg-background border-input text-foreground h-11 pl-9 focus-visible:ring-ring ${errors.pickupLocation ? "border-rose-500 focus:border-rose-500" : ""}`}
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
                                            <Label htmlFor="dropLocation" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Drop Location</Label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="dropLocation"
                                                    placeholder="Enter destination location"
                                                    className={`bg-background border-input text-foreground h-11 pl-9 focus-visible:ring-ring ${errors.dropLocation ? "border-rose-500 focus:border-rose-500" : ""}`}
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
                            <Card className="border-border p-6 bg-card text-card-foreground space-y-4 shadow-sm">
                                <div className="flex items-center gap-2 border-b border-border pb-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <CreditCard size={16} />
                                    </div>
                                    <h2 className="font-bold text-foreground text-base">Select Payment Gateway</h2>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    {paymentOptions.map(({ value, label, icon: Icon, desc }) => {
                                        const isSelected = selectedPayment === value;
                                        return (
                                            <label
                                                key={value}
                                                className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 cursor-pointer transition-all duration-300 select-none
                                                    ${isSelected
                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                        : "border-border hover:border-muted-foreground/55 hover:bg-muted/55"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={value}
                                                    className="sr-only"
                                                    {...register("paymentMethod")}
                                                />
                                                <div className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300
                                                    ${isSelected ? "bg-primary text-primary-foreground scale-110 font-bold" : "bg-muted text-muted-foreground"}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="text-center">
                                                    <p className={`text-sm font-semibold transition-colors duration-250 ${isSelected ? "text-primary" : "text-foreground"}`}>
                                                        {label}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground mt-1">{desc}</p>
                                                </div>
                                                {isSelected && (
                                                    <span className="absolute top-2.5 right-2.5 h-4.5 w-4.5 rounded-full bg-primary flex items-center justify-center border-2 border-background shadow-sm">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
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
                            <Card className="border-border p-6 bg-card text-card-foreground space-y-4 shadow-sm">
                                <div className="flex items-center gap-2 border-b border-border pb-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <FileText size={16} />
                                    </div>
                                    <h2 className="font-bold text-foreground text-base">Additional Instructions</h2>
                                </div>
                                <Textarea
                                    rows={4}
                                    placeholder="Type any instructions, pickup delays, special luggage requirements, etc."
                                    className="bg-background border-input focus-visible:ring-ring text-foreground transition-colors resize-none"
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
                            <Card className="border-border overflow-hidden bg-card text-card-foreground shadow-sm">
                                <div className="relative h-56 overflow-hidden bg-slate-100">
                                    <img
                                        src={car.images?.[0]?.secure_url || fallbackImage}
                                        alt={car.name}
                                        className="w-full h-full object-contain p-2 opacity-95 transition-transform duration-500 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                                    <div className="absolute bottom-4 left-4 text-foreground">
                                        <span className="inline-block px-2.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-2">
                                            {car.brand?.name || "Premium Fleet"}
                                        </span>
                                        <h3 className="text-xl font-bold text-foreground">{car.name}</h3>
                                        <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                                            ⭐ 4.9 (42 reviews)
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">
                                    <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                                        Financial Summary
                                    </h4>

                                    <div className="space-y-3 text-sm text-foreground">
                                        <div className="flex justify-between items-center">
                                            <span>Price Per Day</span>
                                            <span className="font-semibold text-foreground">
                                                ₹{car.pricePerDay?.toLocaleString() || "0"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span>Total Days Selected</span>
                                            <span className="font-semibold text-foreground">
                                                {summary.totalDays > 0 ? `${summary.totalDays} day${summary.totalDays > 1 ? "s" : ""}` : "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-foreground">
                                                {summary.subtotal > 0 ? `₹${summary.subtotal.toLocaleString()}` : "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span>Goods & Services Tax (18%)</span>
                                            <span className="font-semibold text-foreground">
                                                {summary.tax > 0 ? `₹${summary.tax.toFixed(2)}` : "—"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span>Refundable Security Deposit</span>
                                            <span className="font-semibold text-foreground">
                                                ₹{(car.securityDeposit || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-muted border border-border p-4 flex justify-between items-center">
                                        <div>
                                            <span className="font-bold text-foreground text-sm">Grand Total</span>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">All taxes included</p>
                                        </div>
                                        <span className="text-2xl font-black text-foreground">
                                            {summary.total > 0 ? `₹${summary.total.toFixed(2)}` : "—"}
                                        </span>
                                    </div>

                                    <Button
                                        disabled={createBookingMutation.isPending}
                                        onClick={handleSubmit(onSubmit)}
                                        className="w-full h-12 gap-2 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer"
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

                                    <div className="text-center text-[10px] text-muted-foreground pt-1 flex items-center justify-center gap-1">
                                        <ShieldCheck size={12} className="text-emerald-555 text-emerald-500" />
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