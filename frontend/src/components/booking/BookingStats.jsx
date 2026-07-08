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
        color: "bg-blue-100 text-blue-600",
        filter: () => true,
    },
    {
        title: "Active",
        icon: Car,
        color: "bg-green-100 text-green-600",
        filter: (b) => b.bookingStatus === "Active",
    },
    {
        title: "Upcoming",
        icon: Clock3,
        color: "bg-yellow-100 text-yellow-600",
        filter: (b) => b.bookingStatus === "Upcoming" || b.bookingStatus === "Pending",
    },
    {
        title: "Completed",
        icon: CheckCircle2,
        color: "bg-slate-100 text-slate-500",
        filter: (b) => b.bookingStatus === "Completed",
    },
    {
        title: "Cancelled",
        icon: XCircle,
        color: "bg-red-100 text-red-500",
        filter: (b) => b.bookingStatus === "Cancelled",
    },
];

export default function BookingStats({ bookings = [] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {statConfig.map(({ title, icon: Icon, color, filter }) => {
                const count = title === "Total Bookings"
                    ? bookings.length
                    : bookings.filter(filter).length;

                return (
                    <Card
                        key={title}
                        className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-sm text-muted-foreground">{title}</p>
                                <h2 className="mt-1 text-3xl font-extrabold">{count}</h2>
                            </div>

                            <div className={`rounded-full p-3 ${color}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}