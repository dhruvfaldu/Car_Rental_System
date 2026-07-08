import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
    CalendarDays, 
    MapPin, 
    CreditCard, 
    FileText, 
    BadgeInfo, 
    ShieldCheck, 
    Sparkles, 
    ArrowRight, 
    Coins, 
    Check, 
    Wallet, 
    MessageSquareCode
} from "lucide-react";
import { createBooking, getCarById } from "@/features/booking/bookingApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { bookingSchema } from "@/schemas/bookingSchema";

const fallbackImage =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

export default function Booking() {
    const { carId } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

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
    const selectedPaymentMethod = watch("paymentMethod");

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
                toast.error("Failed to load car details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [carId]);

    useEffect(() => {
        if (!car) return;

        if (!pickupDate || !returnDate) {
            setSummary({
                totalDays: 0,
                subtotal: 0,
                tax: 0,
                total: 0,
            });
            return;
        }

        const pickup = new Date(pickupDate);
        const drop = new Date(returnDate);

        const diff = Math.ceil((drop - pickup) / (1000 * 60 * 60 * 24));

        if (diff <= 0) {
            setSummary({
                totalDays: 0,
                subtotal: 0,
                tax: 0,
                total: 0,
            });
            return;
        }

        const subtotal = diff * car.pricePerDay;
        const tax = subtotal * 0.18;
        const total = subtotal + tax + (car.securityDeposit || 0);

        setSummary({
            totalDays: diff,
            subtotal,
            tax,
            total,
        });
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
            <div className="container mx-auto max-w-7xl px-4 py-20">
                <div className="animate-pulse space-y-8">
                    <div className="h-10 bg-slate-200 rounded w-1/3"></div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-64 bg-slate-200 rounded-2xl"></div>
                            <div className="h-40 bg-slate-200 rounded-2xl"></div>
                        </div>
                        <div className="h-96 bg-slate-200 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="container mx-auto text-center py-20">
                <BadgeInfo className="mx-auto text-red-500 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Car Not Found</h2>
                <p className="text-slate-500 mt-2">The requested vehicle is currently unavailable.</p>
                <Button onClick={() => navigate("/cars")} className="mt-6">
                    Back to Catalog
                </Button>
            </div>
        );
    }

    const onSubmit = async (values) => {
        try {
            setBookingLoading(true);

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
            toast.success("Booking initiated successfully!");
            navigate(`/booking/${res.data._id}/confirmation`);
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Unable to create booking."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <main className="bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/20 min-h-screen py-12">
            <div className="container mx-auto max-w-7xl px-4">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <div>
                        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm tracking-wider uppercase mb-1">
                            <Sparkles className="w-4 h-4" />
                            Premium Booking System
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Secure Your Ride
                        </h1>
                    </div>
                    <div className="text-slate-500 text-sm hidden md:block">
                        Need assistance? <span className="font-semibold text-indigo-600 cursor-pointer">Contact Support</span>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Left - Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="p-6 md:p-8 bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-100 rounded-3xl space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                        <CalendarDays className="text-indigo-600 w-6 h-6" />
                                        Rental Specifications
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1">Specify your desired rental timeline and pickup locations.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Pickup Date */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-semibold flex items-center gap-1.5">
                                            Pickup Date
                                        </Label>
                                        <div className="relative">
                                            <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <Input
                                                type="date"
                                                min={new Date().toISOString().split("T")[0]}
                                                className="h-12 pl-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl"
                                                {...register("pickupDate")}
                                            />
                                        </div>
                                        {errors.pickupDate && (
                                            <p className="text-sm text-red-500 font-medium">
                                                {errors.pickupDate.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Return Date */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-semibold flex items-center gap-1.5">
                                            Return Date
                                        </Label>
                                        <div className="relative">
                                            <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <Input
                                                type="date"
                                                min={getMinReturnDate()}
                                                className="h-12 pl-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl"
                                                {...register("returnDate")}
                                            />
                                        </div>
                                        {errors.returnDate && (
                                            <p className="text-sm text-red-500 font-medium">
                                                {errors.returnDate.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Pickup Location */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-semibold flex items-center gap-1.5">
                                            Pickup Location
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <Input
                                                placeholder="e.g. Airport Terminal 1"
                                                className="h-12 pl-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl"
                                                {...register("pickupLocation")}
                                            />
                                        </div>
                                        {errors.pickupLocation && (
                                            <p className="text-sm text-red-500 font-medium">
                                                {errors.pickupLocation.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Drop Location */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-semibold flex items-center gap-1.5">
                                            Drop Location
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <Input
                                                placeholder="e.g. Airport Terminal 1"
                                                className="h-12 pl-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl"
                                                {...register("dropLocation")}
                                            />
                                        </div>
                                        {errors.dropLocation && (
                                            <p className="text-sm text-red-500 font-medium">
                                                {errors.dropLocation.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-slate-100 my-4" />

                                {/* Payment Methods */}
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                                            <CreditCard className="text-indigo-600 w-5 h-5" />
                                            Select Payment Method
                                        </Label>
                                        <p className="text-slate-500 text-sm">Choose how you would like to handle the rental charges.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Online Option */}
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => setValue("paymentMethod", "Online")}
                                            className={`relative border rounded-2xl p-5 cursor-pointer flex flex-col justify-between transition-all ${
                                                selectedPaymentMethod === "Online"
                                                    ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/10 shadow-lg shadow-indigo-100/40"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                {selectedPaymentMethod === "Online" && (
                                                    <span className="bg-indigo-600 text-white rounded-full p-0.5 flex items-center justify-center">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-base">Online Payment</h4>
                                                <p className="text-slate-400 text-xs mt-1">Cards, UPI, NetBanking. Secured by Razorpay.</p>
                                            </div>
                                        </motion.div>

                                        {/* Cash Option */}
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => setValue("paymentMethod", "Cash")}
                                            className={`relative border rounded-2xl p-5 cursor-pointer flex flex-col justify-between transition-all ${
                                                selectedPaymentMethod === "Cash"
                                                    ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/10 shadow-lg shadow-indigo-100/40"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                                                    <Coins className="w-5 h-5" />
                                                </div>
                                                {selectedPaymentMethod === "Cash" && (
                                                    <span className="bg-indigo-600 text-white rounded-full p-0.5 flex items-center justify-center">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-base">Cash Payment</h4>
                                                <p className="text-slate-400 text-xs mt-1">Pay with physical cash directly at the counter.</p>
                                            </div>
                                        </motion.div>

                                        {/* Card Option */}
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => setValue("paymentMethod", "Card")}
                                            className={`relative border rounded-2xl p-5 cursor-pointer flex flex-col justify-between transition-all ${
                                                selectedPaymentMethod === "Card"
                                                    ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/10 shadow-lg shadow-indigo-100/40"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                                                    <Wallet className="w-5 h-5" />
                                                </div>
                                                {selectedPaymentMethod === "Card" && (
                                                    <span className="bg-indigo-600 text-white rounded-full p-0.5 flex items-center justify-center">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-base">Card at Counter</h4>
                                                <p className="text-slate-400 text-xs mt-1">Swipe your debit/credit card at pickup terminal.</p>
                                            </div>
                                        </motion.div>
                                    </div>
                                    {errors.paymentMethod && (
                                        <p className="text-sm text-red-500 font-medium">
                                            {errors.paymentMethod.message}
                                        </p>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-slate-100 my-4" />

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold flex items-center gap-1.5">
                                        <MessageSquareCode className="w-4 h-4 text-indigo-600" />
                                        Additional Notes (Optional)
                                    </Label>
                                    <Textarea
                                        rows={4}
                                        placeholder="Any special instructions or preferences (e.g. child seat, roof rack, etc.)..."
                                        className="bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl p-4"
                                        {...register("notes")}
                                    />
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right - Sticky Invoice Receipt */}
                    <div className="sticky top-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="overflow-hidden border border-slate-200/80 shadow-2xl bg-white rounded-3xl">
                                {/* Image Overlay */}
                                <div className="relative h-56 w-full overflow-hidden">
                                    <img
                                        src={car.images?.[0]?.secure_url || fallbackImage}
                                        alt={car.name}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-5 right-5 text-white flex justify-between items-end">
                                        <div>
                                            <span className="px-2.5 py-1 text-[10px] font-extrabold bg-indigo-600 text-white rounded-full uppercase tracking-wider">
                                                {car.year} Model
                                            </span>
                                            <h3 className="text-xl font-bold mt-1.5 leading-tight">
                                                {car.brand?.name || "Premium"} {car.name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">Rental Breakdown</h3>
                                        <p className="text-slate-400 text-xs mt-0.5">Summary of charges for your reservation.</p>
                                    </div>

                                    {/* Breakdown Items */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-slate-600 text-sm">
                                            <span>Base Rental / Day</span>
                                            <span className="font-semibold text-slate-900">
                                                ₹{car.pricePerDay.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-slate-600 text-sm">
                                            <span>Rental Duration</span>
                                            <span className="font-semibold text-slate-900">
                                                {summary.totalDays} {summary.totalDays === 1 ? "Day" : "Days"}
                                            </span>
                                        </div>

                                        {summary.totalDays > 0 && (
                                            <div className="flex justify-between items-center text-slate-600 text-sm">
                                                <span>Subtotal</span>
                                                <span className="font-semibold text-slate-900">
                                                    ₹{summary.subtotal.toLocaleString()}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center text-slate-600 text-sm">
                                            <span>Goods & Services Tax (18%)</span>
                                            <span className="font-semibold text-slate-900">
                                                ₹{summary.tax.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-slate-600 text-sm">
                                            <span className="flex items-center gap-1">
                                                Security Deposit
                                                <span className="inline-flex items-center text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                                                    Refundable
                                                </span>
                                            </span>
                                            <span className="font-semibold text-slate-900">
                                                ₹{(car.securityDeposit || 0).toLocaleString()}
                                            </span>
                                        </div>

                                        <hr className="border-slate-100" />

                                        <div className="flex justify-between items-baseline py-1">
                                            <span className="text-slate-800 font-bold text-base">Grand Total</span>
                                            <span className="text-2xl font-black text-indigo-600 tracking-tight">
                                                ₹{summary.total.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Security Guarantee Banner */}
                                    <div className="flex gap-2.5 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 text-xs">
                                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>
                                            Your security deposit will be refunded within 24 hours of vehicle return, subject to inspection.
                                        </span>
                                    </div>

                                    {/* Submit Action */}
                                    <Button
                                        disabled={bookingLoading}
                                        onClick={handleSubmit(onSubmit)}
                                        className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100 active:scale-[0.99] transition-transform rounded-2xl flex items-center justify-center gap-2"
                                    >
                                        {bookingLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Creating Booking...
                                            </>
                                        ) : (
                                            <>
                                                Confirm & Book
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}