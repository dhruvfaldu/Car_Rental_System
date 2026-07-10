import React from "react";

const RecentBookings = ({ bookings = [] }) => {
    return (
        <div className="rounded-2xl border border-zinc-850 bg-zinc-900/40 border-zinc-800 backdrop-blur-md p-6 shadow-sm">
            <h2 className="mb-6 text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                Recent Bookings
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-zinc-200 text-sm">
                    <thead>
                        <tr className="border-b border-zinc-800 text-left text-zinc-400 font-semibold">
                            <th className="pb-3 pr-2">Booking ID</th>
                            <th className="pb-3 pr-2">Customer</th>
                            <th className="pb-3 pr-2">Car</th>
                            <th className="pb-3 pr-2">Pickup</th>
                            <th className="pb-3 pr-2">Return</th>
                            <th className="pb-3">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-800/40">
                        {bookings.map((booking) => {
                            let statusStyle = "bg-zinc-800 text-zinc-300 border-zinc-705";
                            if (booking.status === "Pending") statusStyle = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                            else if (booking.status === "Confirmed") statusStyle = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                            else if (booking.status === "Completed") statusStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                            else if (booking.status === "Cancelled") statusStyle = "bg-rose-500/10 text-rose-400 border-rose-500/20";

                            return (
                                <tr
                                    key={booking.id}
                                    className="hover:bg-zinc-900/10 transition-colors"
                                >
                                    <td className="py-3.5 font-semibold text-zinc-300 pr-2">{booking.id}</td>
                                    <td className="py-3.5 text-zinc-300 pr-2">{booking.customer}</td>
                                    <td className="py-3.5 text-zinc-400 pr-2">{booking.car}</td>
                                    <td className="py-3.5 text-zinc-400 pr-2">{booking.pickup}</td>
                                    <td className="py-3.5 text-zinc-400 pr-2">{booking.returnDate}</td>
                                    <td className="py-3.5">
                                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusStyle}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-zinc-500 font-medium">
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