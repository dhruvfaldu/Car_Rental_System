import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCarsQuery } from "@/features/cars/useCarsQuery";
import CarCard from "@/components/Cars/CarCard";
import { Button } from "@/components/ui/button";

export default function CarListing() {
    // Fetch top 3 newest cars as featured vehicles
    const { data, isLoading, isError } = useCarsQuery({ limit: 3, sort: "newest" });

    return (
        <section className="bg-slate-50 py-16 lg:py-24 border-t border-slate-100">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div className="space-y-3">
                        <span className="text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
                            Explore Fleet
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Our Featured Vehicles
                        </h2>
                        <p className="text-slate-500 max-w-xl text-sm lg:text-base">
                            Explore our selection of premium vehicles available for your next adventure. Rent by day with full insurance coverage.
                        </p>
                    </div>

                    <Button asChild variant="outline" className="hidden md:flex rounded-full border-slate-300 font-semibold group">
                        <Link to="/cars">
                            Explore All Cars
                            <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                                <div className="aspect-[16/10] bg-slate-100 rounded-xl" />
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                                    <div className="h-6 bg-slate-100 rounded w-2/3" />
                                    <div className="h-10 bg-slate-100 rounded-xl w-full pt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 font-medium">Failed to load vehicles. Please try again later.</p>
                    </div>
                )}

                {/* Cars Grid */}
                {!isLoading && !isError && data?.data && (
                    <>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {data.data.slice(0, 3).map((car) => (
                                <CarCard key={car._id} car={car} />
                            ))}
                        </div>

                        {/* Mobile action button */}
                        <div className="mt-10 flex justify-center md:hidden">
                            <Button asChild className="w-full rounded-full font-bold h-12 shadow-sm">
                                <Link to="/cars">
                                    Explore All Cars
                                    <ArrowRight size={16} className="ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </>
                )}

            </div>
        </section>
    );
}