import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans relative">
            {/* Sidebar navigation */}
            <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 md:z-auto ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Backdrop overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main view area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top header navigation */}
                <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                {/* Main page content injection point */}
                <main className="flex-1 overflow-y-auto bg-zinc-900/10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
