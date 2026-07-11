import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative flex h-screen w-screen overflow-hidden bg-background font-sans text-foreground">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 md:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <div className="flex h-full flex-1 flex-col overflow-hidden">
                {/* Header */}
                <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
