import React from "react";
import WelcomeSection from "../components/WelcomeSection";
import StatsCard from "../components/StatsCard";
import FleetStatus from "../components/FleetStatus";
import BookingStatus from "../components/BookingStatus";
import BookingChart from "../components/BookingChart";
import RecentBookings from "../components/RecentBookings";
import { useDashboard } from "../hooks/useDashboard";
import { Loader2, Car, CalendarDays, IndianRupee, Users } from "lucide-react";

const Dashboard = () => {
    const { data: dashboardData, isLoading, isError } = useDashboard();

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-zinc-100">
                <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
                <p className="mt-4 text-sm font-medium tracking-wide text-zinc-400 animate-pulse">
                    Loading dashboard analytics...
                </p>
            </div>
        );
    }

    if (isError || !dashboardData) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-zinc-100 p-8 text-center">
                <p className="text-rose-500 font-semibold text-base">Error loading analytics</p>
                <p className="text-zinc-500 text-xs mt-1">Please check if the backend server is running correctly.</p>
            </div>
        );
    }

    const { counts = {}, fleetStatus = [], bookingStatus = [], recentBookings = [] } = dashboardData;

    const cards = [
        {
            id: 1,
            title: "Total Cars",
            value: counts.totalCars || 0,
            icon: Car,
            color: "text-sky-400",
            bg: "bg-sky-500/10 border-sky-500/20",
        },
        {
            id: 2,
            title: "Bookings",
            value: counts.totalBookings || 0,
            icon: CalendarDays,
            color: "text-violet-400",
            bg: "bg-violet-500/10 border-violet-500/20",
        },
        {
            id: 3,
            title: "Revenue",
            value: `₹${(counts.totalRevenue || 0).toLocaleString("en-IN")}`,
            icon: IndianRupee,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10 border-emerald-500/20",
        },
        {
            id: 4,
            title: "Customers",
            value: counts.totalCustomers || 0,
            icon: Users,
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
        },
    ];

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <WelcomeSection />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((item) => (
                    <StatsCard key={item.id} {...item} />
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <FleetStatus data={fleetStatus} />
                <BookingStatus data={bookingStatus} />
            </div>

            <BookingChart data={bookingStatus} />

            <RecentBookings bookings={recentBookings} />
        </div>
    );
};

export default Dashboard;