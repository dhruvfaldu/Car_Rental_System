import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, CreditCard, FileText, CreditCardIcon } from "lucide-react";
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

export default function Booking() {
    const { carId } = useParams();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] =
        useState(false);

    const navigate = useNavigate();

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
                console.log(error);
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

        const diff =
            Math.ceil((drop - pickup) / (1000 * 60 * 60 * 24));

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

        const total =
            subtotal +
            tax +
            (car.securityDeposit || 0);

        setSummary({
            totalDays: diff,
            subtotal,
            tax,
            total,
        });
    }, [pickupDate, returnDate, car]);

    if (loading) {
        return (
            <div className="container py-20 text-center">
                Loading booking...
            </div>
        );
    }

    if (!car) {
        return (
            <div className="container py-20 text-center">
                Car not found.
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

            navigate(
                `/booking/${res.data._id}/confirmation`
            );

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to create booking."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <main className="bg-slate-50 min-h-screen py-10">
            <div className="container mx-auto max-w-7xl px-4">

                <h1 className="text-3xl font-bold mb-8">
                    Book Your Car
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left */}

                    <div className="lg:col-span-2">

                        <Card className="p-6 space-y-6">

                            <h2 className="text-xl font-semibold">
                                Rental Details
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">

                                <div>
                                    <Label>Pickup Date</Label>
                                    <Input
                                        type="date"
                                        min={pickupDate || new Date().toISOString().split("T")[0]}
                                        {...register("pickupDate")}
                                    />
                                    {errors.pickupDate && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.pickupDate.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Return Date</Label>
                                    <Input
                                        type="date"
                                        min={returnDate || new Date().toISOString().split("T")[0]}
                                        {...register("returnDate")}
                                    />
                                    {errors.returnDate && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.returnDate.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Pickup Location</Label>
                                    <Input
                                        placeholder="Pickup Location"
                                        {...register("pickupLocation")}
                                    />
                                    {errors.pickupLocation && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.pickupLocation.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Drop Location</Label>
                                    <Input
                                        placeholder="Drop Location"
                                        {...register("dropLocation")}
                                    />
                                    {errors.dropLocation && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.dropLocation.message}
                                        </p>
                                    )}
                                </div>

                            </div>

                            <div>

                                <Label>Payment Method</Label>

                                <div className="grid grid-cols-2 gap-4">

                                    <label
                                        className="border rounded-xl p-4 cursor-pointer hover:border-primary">

                                        <input
                                            type="radio"
                                            value="Online"
                                            className="hidden"
                                            {...register("paymentMethod")}
                                        />

                                        <div className="text-center">

                                            <CreditCardIcon className="mx-auto mb-2" />

                                            <h4 className="font-semibold">

                                                Online Payment

                                            </h4>

                                        </div>

                                    </label>

                                    <label
                                        className="border rounded-xl p-4 cursor-pointer hover:border-primary">

                                        <input
                                            type="radio"
                                            value="Cash"
                                            className="hidden"
                                            {...register("paymentMethod")}
                                        />

                                        <div className="text-center">

                                            💵

                                            <h4 className="font-semibold">

                                                Cash Payment

                                            </h4>

                                        </div>

                                    </label>

                                     <label
                                        className="border rounded-xl p-4 cursor-pointer hover:border-primary">

                                        <input
                                            type="radio"
                                            value="Card"
                                            className="hidden"
                                            {...register("paymentMethod")}
                                        />

                                        <div className="text-center">

                                            💵

                                            <h4 className="font-semibold">

                                                Card Payment

                                            </h4>

                                        </div>

                                    </label>

                                </div>

                            </div>

                            <div>

                                <Label>Notes</Label>

                                <Textarea
                                    rows={5}
                                    placeholder="Additional instructions..."
                                    {...register("notes")}
                                />

                            </div>

                        </Card>

                    </div>

                    {/* Right */}

                    <div>

                        <Card className="sticky top-24 overflow-hidden">

                            <img
                                src={car.images?.[0]?.secure_url || fallbackImage}
                                className="w-full h-56 object-cover"
                            />

                            <div className="p-6 space-y-4">

                                <h3 className="text-xl font-bold">
                                    {car.brand?.name} {car.name}
                                </h3>

                                <div className="space-y-3">

                                    <div className="flex justify-between">
                                        <span>Price / Day</span>
                                        <span className="font-semibold">
                                            ₹{car.pricePerDay.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Total Days</span>
                                        <span className="font-semibold">
                                            {summary.totalDays}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">
                                            ₹{summary.subtotal.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Tax (18%)</span>
                                        <span className="font-semibold">
                                            ₹{summary.tax.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Security Deposit</span>
                                        <span className="font-semibold">
                                            ₹{(car.securityDeposit || 0).toLocaleString()}
                                        </span>
                                    </div>

                                    <hr />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>

                                        <span className="text-primary">
                                            ₹{summary.total.toLocaleString()}
                                        </span>
                                    </div>

                                </div>

                                <Button
                                    disabled={bookingLoading}
                                    onClick={handleSubmit(onSubmit)}
                                    className="w-full h-11"
                                >
                                    {bookingLoading
                                        ? "Creating Booking..."
                                        : "Continue Booking"}
                                </Button>

                            </div>

                        </Card>

                    </div>

                </div>

            </div>
        </main>
    );
}