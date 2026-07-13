import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Flame,
    ShieldCheck,
    Clock,
    Check,
    ChevronRight,
    AlertCircle,
    ArrowRight,
    Star,
    Award,
    BadgePercent,
    Sparkles,
    MapPin,
    Calendar,
    HelpCircle,
    Compass,
    Users,
    ChevronDown,
    ChevronUp,
    Car
} from "lucide-react";

import { useCarsQuery } from "@/features/cars/useCarsQuery";
import CarCard from "@/components/Cars/CarCard";
import SearchBar from "@/components/home/SearchBar";
import { Button } from "@/components/ui/button";
import { brands, categories } from "@/constants/carFilters";
import heroCar from "@/assets/main_car.png";

// Mock Testimonials data
const testimonials = [
    {
        id: 1,
        name: "Aarav Mehta",
        role: "Business Traveler",
        rating: 5,
        text: "The BMW M340i was in pristine condition, clean, and drove like a dream. The pickup process at Ahmedabad airport was seamless. Highly recommended for premium cars!",
        avatar: "AM"
    },
    {
        id: 2,
        name: "Pooja Sharma",
        role: "Family Vacationer",
        rating: 5,
        text: "Rented an Innova Hycross for our family trip to Udaipur. Extremely comfortable ride, great mileage, and zero hassle. Will definitely book again!",
        avatar: "PS"
    },
    {
        id: 3,
        name: "Vikram Malhotra",
        role: "Car Enthusiast",
        rating: 5,
        text: "Excellent service and a great collection of vehicles. The support team was extremely helpful when I needed to extend my rental for another day.",
        avatar: "VM"
    }
];

// FAQ Data
const faqs = [
    {
        question: "What documents do I need to rent a car?",
        answer: "You will need a valid driver's license (held for at least 2 years), a government-issued ID (Aadhaar Card, Passport, or Voter ID), and a credit/debit card. International renters will need an International Driving Permit (IDP)."
    },
    {
        question: "Is the security deposit refundable?",
        answer: "Yes, the security deposit is fully refundable. It will be credited back to your original payment method within 2-3 business days after you return the vehicle in its original condition."
    },
    {
        question: "Can I cancel or modify my booking?",
        answer: "Absolutely! You can cancel or modify your reservation up to 24 hours before your scheduled pickup time for a full refund. Cancellations made within 24 hours may incur a small one-day rental fee."
    },
    {
        question: "What is the policy for late returns?",
        answer: "We offer a 30-minute grace period for returns. Beyond that, a late return penalty rate is charged per hour as specified in your rental agreement. Please contact customer support if you expect to be delayed."
    },
    {
        question: "Are fuel charges included in the price?",
        answer: "Cars are provided with a full tank of fuel and should be returned with a full tank. If the car is returned with less fuel, refueling charges plus a service fee will be applied."
    }
];

export default function Home() {
    const navigate = useNavigate();
    const { data: carData, isLoading, isError } = useCarsQuery({ limit: 6 });
    const [activeFaq, setActiveFaq] = useState(null);

    const handleCategoryClick = (catName) => {
        navigate(`/cars?category=${encodeURIComponent(catName)}`);
    };

    const handleBrandClick = (brandName) => {
        navigate(`/cars?brand=${encodeURIComponent(brandName)}`);
    };

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    return (
        <div className="bg-slate-50 min-h-screen overflow-x-hidden">
            {/* ── 1. HERO BANNER WITH CTA & SEARCHBAR ── */}
            <section className="relative bg-slate-900 text-white pt-24 pb-32 px-4 overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-slate-800/20 rounded-full blur-[80px] pointer-events-none" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
                                    <Sparkles size={12} /> Premium Car Rental Experience
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                                    Drive Beyond Limits, <br />
                                    Rent Your <span className="text-indigo-500">Dream Ride</span>
                                </h1>
                                <p className="text-slate-400 text-sm md:text-base lg:text-lg leading-relaxed max-w-xl mt-4">
                                    Choose from our premium fleet of SUVs, sedans, and luxury sports vehicles. Perfect conditions, clean interiors, and 24/7 roadside assistance guaranteed.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button asChild size="lg" className="rounded-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-6">
                                        <Link to="/cars">
                                            Explore Fleet
                                            <ArrowRight size={16} className="ml-2" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg" className="rounded-full font-bold border-slate-700 hover:bg-slate-900 text-white cursor-pointer px-6" asChild>
                                        <a href="#how-it-works">Learn More</a>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Hero Image Section */}
                        <div className="lg:col-span-5 relative flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="w-full max-w-lg"
                            >
                                <img
                                    src={heroCar}
                                    alt="Luxury Rental Car"
                                    className="w-full h-auto object-contain filter drop-shadow-[0_20px_50px_rgba(99,102,241,0.2)]"
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* Integrated Search Bar Floating widget */}
                    <div className="mt-16 w-full flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-full max-w-5xl"
                        >
                            <SearchBar />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── 2. FEATURED BRANDS SECTION ── */}
            <section className="py-12 bg-white border-b border-slate-100 px-4">
                <div className="container mx-auto max-w-7xl">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                        Explore Vehicles From Top Global Brands
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-16">
                        {brands.map((brand) => (
                            <button
                                key={brand}
                                onClick={() => handleBrandClick(brand)}
                                className="group relative flex items-center justify-center px-6 py-3 border border-slate-200 hover:border-slate-800 rounded-xl bg-slate-50 transition-all duration-300 hover:scale-105"
                            >
                                <span className="font-extrabold text-sm md:text-base text-slate-500 group-hover:text-slate-900 tracking-wider">
                                    {brand}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. FEATURED CARS (MAXIMUM 6) ── */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                        <div>
                            <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest block mb-2">Featured Fleet</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Our Featured Vehicles
                            </h2>
                            <p className="text-slate-500 mt-2 max-w-lg">
                                Explore a curated selection of our most popular rental options, from fuel-efficient sedans to high-capacity SUVs.
                            </p>
                        </div>
                    </div>

                    {/* Skeletons on Loading */}
                    {isLoading && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                                    <div className="aspect-[16/10] bg-slate-100 rounded-xl" />
                                    <div className="space-y-3">
                                        <div className="h-4 bg-slate-100 rounded w-1/4" />
                                        <div className="h-6 bg-slate-100 rounded w-3/4" />
                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                            <div className="h-4 bg-slate-100 rounded" />
                                            <div className="h-4 bg-slate-100 rounded" />
                                        </div>
                                        <div className="h-10 bg-slate-100 rounded-xl w-full pt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
                            <AlertCircle className="mx-auto text-red-500 h-10 w-10" />
                            <p className="font-semibold text-lg">Failed to retrieve vehicles</p>
                            <p className="text-sm text-red-600">We ran into an error loading the car fleet. Please refresh the page or try again later.</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !isError && (!carData?.data || carData.data.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                            <p className="text-slate-500 font-semibold">No cars available right now.</p>
                        </div>
                    )}

                    {/* Cars Grid */}
                    {!isLoading && !isError && carData?.data && carData.data.length > 0 && (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {carData.data.slice(0, 6).map((car) => (
                                    <CarCard key={car._id} car={car} />
                                ))}
                            </div>

                            {/* View All Cars Button */}
                            <div className="flex justify-center mt-12">
                                <Button asChild size="lg" className="rounded-full font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer px-8 py-6 shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95">
                                    <Link to="/cars" className="flex items-center gap-2">
                                        View All Cars
                                        <ArrowRight size={16} />
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ── 4. POPULAR CAR CATEGORIES ── */}
            <section className="py-20 bg-slate-100 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center max-w-xl mx-auto mb-16">
                        <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest block mb-2">Fleet Diversity</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Popular Car Categories
                        </h2>
                        <p className="text-slate-500 mt-2">
                            Select a category that fits your style and travel needs. From daily drives to luxury experiences.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {categories.map((cat) => {
                            // Find matching mock details for each category type
                            let icon = Car;
                            let desc = "Daily driver";
                            if (cat === "SUV") { icon = Compass; desc = "Off-road & Space"; }
                            else if (cat === "Sedan") { icon = Car; desc = "Comfort & Efficiency"; }
                            else if (cat === "Luxury") { icon = Sparkles; desc = "Premium Class"; }
                            else if (cat === "Sports") { icon = Flame; desc = "Speed & Style"; }
                            else if (cat === "Hatchback") { icon = Users; desc = "Compact City Ride"; }
                            const IconComponent = icon;

                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryClick(cat)}
                                    className="group text-left bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-slate-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-full"
                                >
                                    <div className="h-12 w-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center mb-6 group-hover:bg-slate-600 group-hover:text-white transition-colors duration-300">
                                        <IconComponent size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-slate-600 transition-colors">
                                            {cat}
                                        </h3>
                                        <p className="text-slate-400 text-xs mt-1 leading-normal">
                                            {desc}
                                        </p>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Explore <ChevronRight size={12} />
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 5. WHY CHOOSE US ── */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-5 space-y-6">
                            <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest block">Core Strengths</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                Why Choose Our Car Rental Services?
                            </h2>
                            <p className="text-slate-500 leading-relaxed">
                                We are committed to providing you with premium vehicles, competitive pricing, and a smooth rental experience from start to finish. Read about our key value propositions.
                            </p>
                            <div className="space-y-4 pt-2">
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check size={14} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-950 text-sm">No Hidden Fees</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">What you see is what you pay. Transparent pricing includes basic insurance.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check size={14} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-950 text-sm">Flexible Cancellations</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Cancel up to 24 hours prior to booking for a full reservation refund.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Card 1 */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                                <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                    <Award size={20} />
                                </div>
                                <h3 className="font-extrabold text-slate-950 text-base">Best Rate Guarantee</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    We promise to offer the best competitive rental rates in the region. Found a lower price elsewhere? We'll match it.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                                <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                    <Clock size={20} />
                                </div>
                                <h3 className="font-extrabold text-slate-950 text-base">24/7 Roadside Assistance</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Emergency support is just one phone call away. Breakdowns, flat tires, or locking yourself out - we have your back.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                                <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                    <ShieldCheck size={20} />
                                </div>
                                <h3 className="font-extrabold text-slate-950 text-base">Fully Sanitized Vehicles</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Each car undergoes rigorous interior sanitation, deep-clean vacuuming, and inspection prior to handover.
                                </p>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                                <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                    <BadgePercent size={20} />
                                </div>
                                <h3 className="font-extrabold text-slate-950 text-base">Loyalty Program Benefits</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Earn rental loyalty credits for every kilometer driven. Redeem credits for free rental days or fleet upgrades.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. HOW IT WORKS ── */}
            <section id="how-it-works" className="py-20 bg-slate-950 text-white px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center max-w-xl mx-auto mb-16">
                        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest block mb-2">Simplicity First</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            How It Works in 4 Easy Steps
                        </h2>
                        <p className="text-slate-400 mt-2">
                            Getting on the road has never been simpler. Follow our straightforward self-rental workflow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Step 1 */}
                        <div className="space-y-4 relative text-center">
                            <div className="h-16 w-16 mx-auto rounded-full bg-slate-900 border-2 border-indigo-500 text-indigo-400 flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-500/10">
                                01
                            </div>
                            <h3 className="font-bold text-white text-lg">Specify Search criteria</h3>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                                Choose pickup location, pickup date, and return date on our search widget.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-4 relative text-center">
                            <div className="h-16 w-16 mx-auto rounded-full bg-slate-900 border-2 border-indigo-500 text-indigo-400 flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-500/10">
                                02
                            </div>
                            <h3 className="font-bold text-white text-lg">Pick Your Vehicle</h3>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                                Browse our large selection of vehicles. Pick the sedan, SUV, or luxury car that fits.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-4 relative text-center">
                            <div className="h-16 w-16 mx-auto rounded-full bg-slate-900 border-2 border-indigo-500 text-indigo-400 flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-500/10">
                                03
                            </div>
                            <h3 className="font-bold text-white text-lg">Fast Checkout</h3>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                                Complete booking in under 2 minutes. Enter payment details securely.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="space-y-4 relative text-center">
                            <div className="h-16 w-16 mx-auto rounded-full bg-slate-900 border-2 border-indigo-500 text-indigo-400 flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-500/10">
                                04
                            </div>
                            <h3 className="font-bold text-white text-lg">Drive & Enjoy</h3>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                                Collect the keys from our location or receive airport delivery. Hit the road!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. CUSTOMER TESTIMONIALS ── */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center max-w-xl mx-auto mb-16">
                        <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest block mb-2">Customer Voice</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            What Our Renters Say
                        </h2>
                        <p className="text-slate-500 mt-2">
                            Don't just take our word for it. Read honest feedback from our recent satisfied clients.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {testimonials.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                                <div className="space-y-4">
                                    <div className="flex gap-0.5 text-amber-400">
                                        {Array.from({ length: item.rating }).map((_, idx) => (
                                            <Star key={idx} size={16} fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 text-xs md:text-sm italic leading-relaxed">
                                        "{item.text}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
                                    <div className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                                        {item.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-950 text-sm">{item.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-semibold">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 8. FAQS SECTION ── */}
            <section className="py-20 bg-white px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest block mb-2">Help Center</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-slate-500 mt-2">
                            Have questions? We have compiled responses to the queries most commonly asked by our guests.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => {
                            const isOpen = activeFaq === idx;
                            return (
                                <div
                                    key={idx}
                                    className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition"
                                >
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm md:text-base cursor-pointer focus:outline-none"
                                    >
                                        <span className="flex items-center gap-2">
                                            <HelpCircle size={18} className="text-indigo-600 shrink-0" />
                                            {faq.question}
                                        </span>
                                        {isOpen ? (
                                            <ChevronUp size={18} className="text-slate-400 shrink-0" />
                                        ) : (
                                            <ChevronDown size={18} className="text-slate-400 shrink-0" />
                                        )}
                                    </button>

                                    {isOpen && (
                                        <div className="px-6 pb-5 pt-0 text-slate-600 text-xs md:text-sm leading-relaxed border-t border-slate-100 bg-white">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 9. CALL-TO-ACTION SECTION ── */}
            <section className="py-20 px-4 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
                <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-6">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                        Ready to Hit the Road? <br />
                        Reserve Your Premium Car Today.
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        Don't let transport hold you back. Rent a safe, vetted, and sanitised vehicle within 2 minutes. Skip the queues with premium airport delivery.
                    </p>
                    <div className="pt-4 flex justify-center">
                        <Button asChild size="lg" className="rounded-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-8 py-6 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                            <Link to="/cars" className="flex items-center gap-2">
                                Book Your Ride Now
                                <ArrowRight size={18} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
