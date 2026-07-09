import { recentBookings } from "../data/dashboardData";

const RecentBookings = () => {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">
                Recent Bookings
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="pb-3">Booking</th>
                            <th className="pb-3">Customer</th>
                            <th className="pb-3">Car</th>
                            <th className="pb-3">Pickup</th>
                            <th className="pb-3">Return</th>
                            <th className="pb-3">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recentBookings.map((booking) => (
                            <tr
                                key={booking.id}
                                className="border-b"
                            >
                                <td className="py-4">{booking.id}</td>
                                <td>{booking.customer}</td>
                                <td>{booking.car}</td>
                                <td>{booking.pickup}</td>
                                <td>{booking.returnDate}</td>

                                <td>
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentBookings;