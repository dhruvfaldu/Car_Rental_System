import { useState } from "react";
import BookingCard from "@/components/booking/BookingCard";
import BookingStats from "@/components/booking/BookingStats";
import BookingFilters from "@/components/booking/BookingFilters";
import useMyBookings from "@/features/booking/useBookingMutation";
import { Loader2, CalendarX, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function MyBooking() {
    const [tempSearch, setTempSearch] = useState("");
    const [tempStatus, setTempStatus] = useState("");

    const [appliedFilters, setAppliedFilters] = useState({
        search: "",
        bookingStatus: "",
    });

    const {
        data,
        isLoading,
        isError,
        refetch,
        isRefetching,
    } = useMyBookings(appliedFilters);

    const bookings = data?.data || [];

    const handleApply = () => {
        setAppliedFilters({
            search: tempSearch,
            bookingStatus: tempStatus,
        });
    };

    const handleReset = () => {
        setTempSearch("");
        setTempStatus("");
        setAppliedFilters({
            search: "",
            bookingStatus: "",
        });
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="bg-gradient-to-br from-zinc-900 to-indigo-950 text-white border-b border-zinc-800">
                <div className="mx-auto max-w-7xl px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">My Reservations</h1>
                        <p className="mt-2 text-zinc-350 text-sm md:text-base">
                            Track active rides, pay pending invoices, or manage booking details.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        disabled={isLoading || isRefetching}
                        className="self-start md:self-auto border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-all gap-1.5 font-semibold text-xs"
                    >
                        <RefreshCw size={14} className={isRefetching ? "animate-spin" : ""} />
                        Sync Bookings
                    </Button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
                <BookingStats bookings={bookings} />

                <BookingFilters
                    search={tempSearch}
                    setSearch={setTempSearch}
                    status={tempStatus}
                    setStatus={setTempStatus}
                    onApply={handleApply}
                    onReset={handleReset}
                />

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 size={44} className="animate-spin text-sky-500" />
                        <p className="text-zinc-400 font-medium animate-pulse">Retrieving your bookings...</p>
                    </div>
                )}

                {isError && !isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center max-w-sm mx-auto bg-zinc-900/35 rounded-2xl border border-zinc-800 p-8 shadow-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-455 text-rose-400">
                            <CalendarX size={26} />
                        </div>
                        <div>
                            <p className="font-extrabold text-zinc-200 text-lg">Server Error</p>
                            <p className="text-zinc-450 text-xs mt-1 leading-relaxed">
                                We encountered an error loading your reservations list. Please try refreshing.
                            </p>
                        </div>
                        <Button onClick={() => refetch()} className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold">
                            Try Again
                        </Button>
                    </div>
                )}

                {!isLoading && !isError && bookings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center max-w-md mx-auto bg-zinc-900/35 rounded-2xl border border-zinc-800 p-8 shadow-sm">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-450">
                            <CalendarX size={28} />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-200 text-lg">No Bookings Found</p>
                            <p className="text-zinc-450 mt-1.5 text-xs leading-relaxed">
                                {appliedFilters.search || appliedFilters.bookingStatus
                                    ? "We couldn't find matches for the active search criteria."
                                    : "You haven't reserved any vehicles yet. Let's find your dream car!"}
                            </p>
                        </div>
                        {(appliedFilters.search || appliedFilters.bookingStatus) ? (
                            <Button variant="outline" onClick={handleReset} className="w-full border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-900">
                                Clear Filters
                            </Button>
                        ) : (
                            <Button className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold" onClick={() => window.location.href = "/cars"}>
                                Book a Car Now
                            </Button>
                        )}
                    </div>
                )}

                {!isLoading && !isError && bookings.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="space-y-5"
                    >
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                            />
                        ))}
                    </motion.div>
                )}

            </div>
        </div>
    );
}

export default MyBooking;