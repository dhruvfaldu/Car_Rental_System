import React, { useState } from "react";
import useMyBookings from "@/features/booking/useBookingMutation";
import BookingCard from "@/components/booking/BookingCard";
import { Loader2, CalendarX, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Bookings() {
    const { data, isLoading, isError, refetch } = useMyBookings({});
    const bookings = data?.data || [];

    // Filter categories
    const currentBookings = bookings.filter(
        b => ["Pending", "Confirmed", "Active", "Picked Up", "Upcoming"].includes(b.bookingStatus)
    );
    const pastBookings = bookings.filter(
        b => ["Completed", "Cancelled", "Returned"].includes(b.bookingStatus)
    );

    return (
        <div className="space-y-6 text-zinc-100">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">My Reservations</h3>
                    <p className="text-sm text-zinc-450 text-zinc-450 text-zinc-400">View and track your rental bookings history.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    className="border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-all gap-1.5 h-10 text-xs font-semibold"
                >
                    <RefreshCw size={13} />
                    Sync
                </Button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 size={36} className="animate-spin text-sky-500" />
                    <p className="text-sm text-zinc-400 font-medium animate-pulse">Loading bookings...</p>
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center max-w-sm mx-auto">
                    <CalendarX size={36} className="text-rose-500" />
                    <h4 className="text-base font-bold text-zinc-200">Failed to load reservations</h4>
                    <p className="text-xs text-zinc-500">We couldn't retrieve your list of bookings. Please try again.</p>
                    <Button onClick={() => refetch()} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
                        Try Again
                    </Button>
                </div>
            ) : (
                <Tabs defaultValue="current" className="w-full">
                    <TabsList className="bg-zinc-950 border border-zinc-850 border-zinc-800 w-full p-1 rounded-xl grid grid-cols-2 mb-6">
                        <TabsTrigger
                            value="current"
                            className="rounded-lg text-xs font-semibold py-2.5 data-[state=active]:bg-zinc-900 data-[state=active]:text-sky-400 data-[state=active]:border data-[state=active]:border-zinc-800 transition-all"
                        >
                            Active & Upcoming ({currentBookings.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="past"
                            className="rounded-lg text-xs font-semibold py-2.5 data-[state=active]:bg-zinc-900 data-[state=active]:text-sky-400 data-[state=active]:border data-[state=active]:border-zinc-800 transition-all"
                        >
                            Past History ({pastBookings.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="current" className="space-y-4 focus-visible:outline-none">
                        {currentBookings.map((booking) => (
                            <BookingCard key={booking._id} booking={booking} />
                        ))}
                        {currentBookings.length === 0 && (
                            <EmptyDashboardState
                                message="No active or upcoming reservations found."
                                buttonText="Book a Car"
                                link="/cars"
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4 focus-visible:outline-none">
                        {pastBookings.map((booking) => (
                            <BookingCard key={booking._id} booking={booking} />
                        ))}
                        {pastBookings.length === 0 && (
                            <EmptyDashboardState
                                message="No rental history entries found."
                            />
                        )}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}

function EmptyDashboardState({ message, buttonText, link }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10 p-6">
            <CheckCircle className="h-8 w-8 text-zinc-600" />
            <p className="text-xs text-zinc-400">{message}</p>
            {buttonText && link && (
                <Button
                    onClick={() => window.location.href = link}
                    className="h-9 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-lg hover:shadow-sky-500/10 mt-1"
                >
                    {buttonText}
                </Button>
            )}
        </div>
    );
}
