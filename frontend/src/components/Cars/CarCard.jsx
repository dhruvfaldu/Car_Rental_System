import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, Flame, Users, Calendar, ArrowRight, Ban } from "lucide-react";

const fallbackImage = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

export default function CarCard({ car }) {
    if (!car) return null;

    const mainImage = car.images?.[0]?.secure_url || fallbackImage;
    const isAvailable = car.status === "available";

    return (
        <Card className={`group overflow-hidden bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full ${
            !isAvailable ? "border-slate-200 opacity-80" : "border-slate-200 hover:border-indigo-200"
        }`}>

            {/* Image section */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                    src={mainImage}
                    alt={car.name}
                    className={`h-full w-full object-cover object-center transition-transform duration-500 ease-in-out ${
                        isAvailable ? "group-hover:scale-105" : "grayscale-[30%]"
                    }`}
                    onError={(e) => { e.target.src = fallbackImage; }}
                />

                {/* Unavailable Overlay */}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="flex items-center gap-2 bg-slate-900/80 text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg">
                            <Ban size={16} />
                            Not Available
                        </div>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className="bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-0.5 shadow-sm">
                        {car.category?.name || "Premium"}
                    </Badge>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    <Badge
                        variant="secondary"
                        className={`text-xs font-bold px-2.5 py-0.5 border shadow-sm ${
                            isAvailable
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    >
                        {isAvailable ? "✓ Available" : "✗ Booked"}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">

                <div className="space-y-1">
                    <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                        {car.brand?.name || "Premium Fleet"}
                    </span>
                    <h3 className={`text-lg font-extrabold text-slate-900 transition truncate ${
                        isAvailable ? "group-hover:text-slate-900/60" : ""
                    }`}>
                        {car.name}
                    </h3>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                        <Compass size={15} className="text-slate-400" />
                        <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Flame size={15} className="text-slate-400" />
                        <span>{car.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users size={15} className="text-slate-400" />
                        <span>{car.seats} Seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-slate-400" />
                        <span>{car.year}</span>
                    </div>
                </div>

                {/* Price and Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Price per day
                        </span>
                        <span className="text-base font-extrabold text-slate-900 font-mono">
                            ₹{car.pricePerDay.toLocaleString()}
                        </span>
                    </div>

                    {isAvailable ? (
                        <Button asChild size="sm" className="rounded-xl px-4 font-bold shadow-sm bg-slate-600 hover:bg-slate-700 text-white group/btn shrink-0">
                            <Link to={`/cars/${car.slug}`}>
                                View Details
                                <ArrowRight size={14} className="ml-1.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </Button>
                    ) : (
                        <Button size="sm" disabled className="rounded-xl px-4 font-bold bg-slate-100 text-slate-400 cursor-not-allowed shrink-0">
                            <Ban size={14} className="mr-1.5" />
                            Unavailable
                        </Button>
                    )}
                </div>

            </div>

        </Card>
    );
}