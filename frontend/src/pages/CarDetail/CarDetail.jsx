import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { 
    Car, 
    Calendar, 
    Gauge, 
    Milestone, 
    Flame, 
    ShieldCheck, 
    DollarSign, 
    Clock, 
    ChevronRight, 
    AlertCircle, 
    MapPin, 
    Check,
    ArrowLeft,
    Compass
} from "lucide-react";
import { useCarDetailQuery } from "@/features/cars/useCarsQuery";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const fallbackImage = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

export default function CarDetail() {
    const { slug } = useParams();
    const { data: response, isLoading, isError } = useCarDetailQuery(slug);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-slate-600 font-medium animate-pulse">Loading vehicle specifications...</p>
                </div>
            </div>
        );
    }

    if (isError || !response?.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
                <Card className="max-w-md p-8 text-center space-y-6 shadow-xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Vehicle Not Found</h2>
                        <p className="mt-2 text-slate-500">We couldn't retrieve the details for this car. It may have been removed or the link is incorrect.</p>
                    </div>
                    <Button asChild className="w-full">
                        <Link to="/cars">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Car Listing
                        </Link>
                    </Button>
                </Card>
            </div>
        );
    }

    const car = response.data;
    const images = car.images?.length > 0 ? car.images : [{ secure_url: fallbackImage }];
    const activeImage = images[activeImageIndex]?.secure_url || fallbackImage;

    return (
        <main className="min-h-screen bg-slate-50 py-8 lg:py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Breadcrumbs & Navigation */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link to="/" className="hover:text-primary transition">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/cars" className="hover:text-primary transition">Cars</Link>
                    <ChevronRight size={14} />
                    <span className="text-slate-900 font-medium truncate max-w-xs">{car.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left & Middle Column: Title, Images, Specifications, Features */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Title Section */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge className="bg-primary text-white text-xs font-semibold px-3 py-1">
                                    {car.category?.name || "Premium"}
                                </Badge>
                                <Badge variant="outline" className={`border font-semibold text-xs px-3 py-1 ${
                                    car.status === "available" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"
                                }`}>
                                    {car.status ? car.status.charAt(0).toUpperCase() + car.status.slice(1) : "Available"}
                                </Badge>
                            </div>
                            
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                                    {car.brand?.name} {car.name}
                                </h1>
                                <p className="text-slate-500 mt-1 flex items-center gap-1.5 text-sm">
                                    <Calendar size={15} /> Model Year {car.year} &bull; {car.color || "Dynamic Color"}
                                </p>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-md transition-all duration-300 hover:shadow-lg">
                                <img 
                                    src={activeImage} 
                                    alt={`${car.brand?.name} ${car.name}`} 
                                    className="h-full w-full object-cover object-center transition duration-500 ease-in-out"
                                    onError={(e) => { e.target.src = fallbackImage; }}
                                />
                            </div>

                            {/* Thumbnail row if multiple images exist */}
                            {images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative aspect-[3/2] w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 transition ${
                                                activeImageIndex === idx ? "border-primary shadow-sm" : "border-slate-200 hover:border-slate-400"
                                            }`}
                                        >
                                            <img 
                                                src={img.secure_url} 
                                                alt="thumbnail" 
                                                className="h-full w-full object-cover object-center"
                                                onError={(e) => { e.target.src = fallbackImage; }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {car.description && (
                            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                                <h3 className="text-lg font-bold text-slate-900">About this Vehicle</h3>
                                <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                                    {car.description}
                                </p>
                            </section>
                        )}

                        {/* Specifications */}
                        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-slate-900">Technical Specifications</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                                        <Compass size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400 font-medium">Transmission</span>
                                        <span className="text-sm font-bold text-slate-800">{car.transmission}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                                        <Flame size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400 font-medium">Fuel Type</span>
                                        <span className="text-sm font-bold text-slate-800">{car.fuelType}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                                        <Car size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400 font-medium">Capacity</span>
                                        <span className="text-sm font-bold text-slate-800">{car.seats} Seats</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                                        <Gauge size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400 font-medium">Mileage</span>
                                        <span className="text-sm font-bold text-slate-800">{car.mileage ? `${car.mileage} km/l` : "Not Specified"}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                                        <Milestone size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400 font-medium">Daily Limit</span>
                                        <span className="text-sm font-bold text-slate-800">{car.allowedKMPerDay} KM included</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400 font-medium">Registration</span>
                                        <span className="text-sm font-bold text-slate-800 tracking-wider truncate max-w-[120px] block">{car.registrationNumber}</span>
                                    </div>
                                </div>

                            </div>
                        </section>

                        {/* Features Checklist */}
                        {car.features?.length > 0 && (
                            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-lg font-bold text-slate-900">Vehicle Features</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {car.features.map((feature) => (
                                        <div key={feature._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                <Check size={14} />
                                            </div>
                                            <span className="text-sm text-slate-700 font-medium">{feature.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Right Column: Pricing & Booking Summary */}
                    <div>
                        <Card className="sticky top-24 overflow-hidden border-slate-200 shadow-lg bg-white rounded-2xl">
                            
                            {/* Card Header Price */}
                            <div className="bg-slate-950 p-6 text-white text-center space-y-1">
                                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Rental Rate</span>
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-3xl font-extrabold font-mono">₹{car.pricePerDay.toLocaleString()}</span>
                                    <span className="text-sm text-slate-400">/ day</span>
                                </div>
                            </div>

                            {/* Card Details Body */}
                            <div className="p-6 space-y-6">
                                
                                <div className="space-y-4">
                                    
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 flex items-center gap-1.5">
                                            <ShieldCheck size={16} /> Refundable Security Deposit
                                        </span>
                                        <span className="font-bold text-slate-800">₹{car.securityDeposit ? car.securityDeposit.toLocaleString() : "0"}</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 flex items-center gap-1.5">
                                            <Milestone size={16} /> Extra Charge (Over KM Limit)
                                        </span>
                                        <span className="font-bold text-slate-800">₹{car.pricePerKM}/KM</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 flex items-center gap-1.5">
                                            <Clock size={16} /> Late Return Penalty Rate
                                        </span>
                                        <span className="font-bold text-slate-800">₹{car.lateFeePerHour}/hr</span>
                                    </div>

                                </div>

                                {/* Booking Call to Action */}
                                <div className="space-y-3">
                                    <Button asChild size="lg" className="w-full text-base font-bold h-12 shadow-sm" disabled={car.status !== "available"}>
                                        {car.status === "available" ? (
                                            <Link to={`/booking/${car._id}`}>
                                                Proceed to Booking
                                            </Link>
                                        ) : (
                                            <span>Currently Unavailable</span>
                                        )}
                                    </Button>
                                    
                                    <p className="text-xs text-center text-slate-400">
                                        You won't be charged yet. Deposit is fully refundable upon return.
                                    </p>
                                </div>

                            </div>
                        </Card>
                    </div>

                </div>

            </div>
        </main>
    );
}
