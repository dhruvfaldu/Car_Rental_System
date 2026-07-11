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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                        My Reservations
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        View and track your rental bookings history.
                    </p>
                </div>

                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    className="h-10 gap-1.5"
                >
                    <RefreshCw size={13} />
                    Sync
                </Button>
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20">
                    <Loader2
                        size={36}
                        className="animate-spin text-primary"
                    />

                    <p className="animate-pulse text-sm font-medium text-muted-foreground">
                        Loading bookings...
                    </p>
                </div>
            ) : isError ? (
                /* Error */
                <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-3 py-12 text-center">
                    <CalendarX
                        size={36}
                        className="text-destructive"
                    />

                    <h4 className="text-base font-bold text-foreground">
                        Failed to load reservations
                    </h4>

                    <p className="text-xs text-muted-foreground">
                        We couldn't retrieve your list of bookings. Please try again.
                    </p>

                    <Button
                        onClick={() => refetch()}
                        className="w-full bg-primary text-primary-foreground hover:opacity-90"
                    >
                        Try Again
                    </Button>
                </div>
            ) : (
                <Tabs
                    defaultValue="current"
                    className="flex w-full flex-col"
                >
                    <TabsList className="mb-6 grid w-full grid-cols-2 rounded-xl border border-border bg-muted p-1">
                        <TabsTrigger
                            value="current"
                            className="rounded-lg py-2.5 text-xs font-semibold transition-all data-[state=active]:border data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-primary"
                        >
                            Active & Upcoming ({currentBookings.length})
                        </TabsTrigger>

                        <TabsTrigger
                            value="past"
                            className="rounded-lg py-2.5 text-xs font-semibold transition-all data-[state=active]:border data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-primary"
                        >
                            Past History ({pastBookings.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="current"
                        className="space-y-4 focus-visible:outline-none"
                    >
                        {currentBookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                            />
                        ))}

                        {currentBookings.length === 0 && (
                            <EmptyDashboardState
                                message="No active or upcoming reservations found."
                                buttonText="Book a Car"
                                link="/cars"
                            />
                        )}
                    </TabsContent>

                    <TabsContent
                        value="past"
                        className="space-y-4 focus-visible:outline-none"
                    >
                        {pastBookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                            />
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
