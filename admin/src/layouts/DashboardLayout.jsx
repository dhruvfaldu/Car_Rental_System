import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";

const DashboardLayout = () => {
    return (
        <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
            {/* Sidebar navigation */}
            <Sidebar />

            {/* Main view area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top header navigation */}
                <Header />

                {/* Main page content injection point */}
                <main className="flex-1 overflow-y-auto bg-zinc-900/10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
