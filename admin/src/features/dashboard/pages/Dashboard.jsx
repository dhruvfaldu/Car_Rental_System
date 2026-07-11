import React from "react";
import WelcomeSection from "../components/WelcomeSection";
import StatsCard from "../components/StatsCard";
import FleetStatus from "../components/FleetStatus";
import BookingStatus from "../components/BookingStatus";
import BookingChart from "../components/BookingChart";
import RecentBookings from "../components/RecentBookings";
import { useDashboard } from "../hooks/useDashboard";
import {
    Loader2,
    Car,
    CalendarDays,
    IndianRupee,
    Users,
} from "lucide-react";

const Dashboard = () => {
    const { data: dashboardData, isLoading, isError } = useDashboard();

    if (isLoading) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />

                <p className="mt-4 animate-pulse text-sm font-medium tracking-wide text-muted-foreground">
                    Loading dashboard analytics...
                </p>
            </div>
        );
    }

    if (isError || !dashboardData) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
                <p className="text-base font-semibold text-destructive">
                    Error loading analytics
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                    Please check if the backend server is running correctly.
                </p>
            </div>
        );
    }

    const {
        counts = {},
        fleetStatus = [],
        bookingStatus = [],
        recentBookings = [],
    } = dashboardData;

    const cards = [
        {
            id: 1,
            title: "Total Cars",
            value: counts.totalCars || 0,
            icon: Car,
            color: "text-primary",
            bg: "bg-primary/10 border-primary/20",
        },
        {
            id: 2,
            title: "Bookings",
            value: counts.totalBookings || 0,
            icon: CalendarDays,
            color: "text-chart-2",
            bg: "bg-chart-2/10 border-chart-2/20",
        },
        {
            id: 3,
            title: "Revenue",
            value: `₹${(counts.totalRevenue || 0).toLocaleString("en-IN")}`,
            icon: IndianRupee,
            color: "text-chart-1",
            bg: "bg-chart-1/10 border-chart-1/20",
        },
        {
            id: 4,
            title: "Customers",
            value: counts.totalCustomers || 0,
            icon: Users,
            color: "text-chart-5",
            bg: "bg-chart-5/10 border-chart-5/20",
        },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-8">
            <WelcomeSection />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((item) => (
                    <StatsCard key={item.id} {...item} />
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <FleetStatus data={fleetStatus} />
                <BookingStatus data={bookingStatus} />
                <BookingChart data={bookingStatus} />

            </div>
            
            <RecentBookings bookings={recentBookings} />
        </div>
    );
};

export default Dashboard;