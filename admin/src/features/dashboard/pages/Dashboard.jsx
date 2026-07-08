import WelcomeSection from "../components/WelcomeSection";
import StatsCard from "../components/StatsCard";
import FleetStatus from "../components/FleetStatus";
import BookingStatus from "../components/BookingStatus";
import BookingChart from "../components/BookingChart";
import RecentBookings from "../components/RecentBookings";

import { stats } from "../data/dashboardData";

const Dashboard = () => {
    return (
        <div className="space-y-8 p-10">
            <WelcomeSection />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <StatsCard key={item.id} {...item} />
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <FleetStatus />
                <BookingStatus />
            </div>

            <BookingChart />

            <RecentBookings />
        </div>
    );
};

export default Dashboard;