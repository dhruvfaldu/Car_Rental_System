import React from "react";

const RecentBookings = ({ bookings = [] }) => {
    return (
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-md">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
                Recent Bookings
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border text-left font-semibold text-muted-foreground">
                            <th className="pb-3 pr-2">Booking ID</th>
                            <th className="pb-3 pr-2">Customer</th>
                            <th className="pb-3 pr-2">Car</th>
                            <th className="pb-3 pr-2">Pickup</th>
                            <th className="pb-3 pr-2">Return</th>
                            <th className="pb-3">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {bookings.map((booking) => {
                            let statusStyle =
                                "bg-muted text-muted-foreground border-border";

                            if (booking.status === "Pending")
                                statusStyle =
                                    "bg-chart-5/10 text-chart-5 border-chart-5/20";

                            else if (booking.status === "Confirmed")
                                statusStyle =
                                    "bg-chart-2/10 text-chart-2 border-chart-2/20";

                            else if (booking.status === "Completed")
                                statusStyle =
                                    "bg-chart-1/10 text-chart-1 border-chart-1/20";

                            else if (booking.status === "Cancelled")
                                statusStyle =
                                    "bg-destructive/10 text-destructive border-destructive/20";

                            return (
                                <tr
                                    key={booking.id}
                                    className="transition-colors hover:bg-accent/40"
                                >
                                    <td className="py-3.5 pr-2 font-semibold text-foreground">
                                        {booking.id}
                                    </td>

                                    <td className="py-3.5 pr-2 text-foreground">
                                        {booking.customer}
                                    </td>

                                    <td className="py-3.5 pr-2 text-muted-foreground">
                                        {booking.car}
                                    </td>

                                    <td className="py-3.5 pr-2 text-muted-foreground">
                                        {booking.pickup}
                                    </td>

                                    <td className="py-3.5 pr-2 text-muted-foreground">
                                        {booking.returnDate}
                                    </td>

                                    <td className="py-3.5">
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusStyle}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}

                        {bookings.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-8 text-center font-medium text-muted-foreground"
                                >
                                    No recent bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentBookings;