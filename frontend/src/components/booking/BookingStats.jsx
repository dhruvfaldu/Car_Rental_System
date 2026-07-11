import {
    CalendarDays,
    Car,
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

const statConfig = [
    {
        title: "Total Bookings",
        icon: CalendarDays,
        color: "bg-sky-500/10 text-sky-400 border border-sky-500/20 border-l-4",
        filter: () => true,
    },
    {
        title: "Active",
        icon: Car,
        color: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 border-l-4",
        filter: (b) => b.bookingStatus === "Active" || b.bookingStatus === "Picked Up",
    },
    {
        title: "Upcoming",
        icon: Clock3,
        color: "bg-amber-500/10 text-amber-400 border border-amber-500/20 border-l-4",
        filter: (b) => b.bookingStatus === "Upcoming" || b.bookingStatus === "Pending" || b.bookingStatus === "Confirmed",
    },
    {
        title: "Completed",
        icon: CheckCircle2,
        color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 border-l-4",
        filter: (b) => b.bookingStatus === "Completed",
    },
    {
        title: "Cancelled",
        icon: XCircle,
        color: "bg-rose-500/10 text-rose-455 text-rose-400 border border-rose-500/20 border-l-4",
        filter: (b) => b.bookingStatus === "Cancelled",
    },
];

export default function BookingStats({ bookings = [] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {statConfig.map(({ title, icon: Icon, color, filter, className }) => {
                const count =
                    title === "Total Bookings"
                        ? bookings.length
                        : bookings.filter(filter).length;

                return (
                    <Card
                        key={title}
                        className={`bg-card border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
                    >
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {title}
                                </p>

                                <h2 className="mt-1 text-2xl font-extrabold text-foreground">
                                    {count}
                                </h2>
                            </div>

                            <div
                                className={`rounded-full p-2.5 ${color}`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}