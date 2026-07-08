import BookingCard from "@/components/booking/BookingCard";
import BookingStats from "@/components/booking/BookingStats";
import BookingFilters from "@/components/booking/BookingFilters";
import useMyBookings from "@/features/booking/useBookingMutation";
import { Loader2, CalendarX } from "lucide-react";

function MyBooking() {
  const {
    data,
    isLoading,
    isError,
  } = useMyBookings();

  const bookings = data?.data || [];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero header ── */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-4xl font-extrabold tracking-tight">My Bookings</h1>
          <p className="mt-2 text-primary-foreground/75 text-base">
            View and manage all your car reservations.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">

        {/* Stats */}
        <BookingStats bookings={bookings} />

        {/* Filters */}
        <BookingFilters />

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={40} className="animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Loading your bookings…</p>
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <CalendarX size={30} className="text-destructive" />
            </div>
            <p className="font-semibold text-lg">Failed to load bookings</p>
            <p className="text-muted-foreground text-sm">Please try refreshing the page.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <CalendarX size={36} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-xl">No Bookings Yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Your booking history will appear here once you make a reservation.
              </p>
            </div>
          </div>
        )}

        {/* Booking list */}
        {!isLoading && !isError && bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id ?? booking.bookingNumber}
                booking={booking}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyBooking;