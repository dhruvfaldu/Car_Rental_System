import React from "react";

const FleetStatus = ({ data = [] }) => {
    return (
        <div className="rounded-2xl border border-zinc-850 bg-zinc-900/40 border-zinc-800 backdrop-blur-md p-6 shadow-sm">
            <h2 className="mb-6 text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                Fleet Distribution
            </h2>

            <div className="space-y-4">
                {data.map((item) => {
                    let color = "bg-zinc-600";
                    if (item.label === "Available") color = "bg-emerald-500";
                    else if (item.label === "Booked") color = "bg-sky-500";
                    else if (item.label === "Rented") color = "bg-amber-500";
                    else if (item.label === "Maintenance") color = "bg-rose-500";

                    return (
                        <div
                            key={item.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${color}`}
                                />
                                <span className="text-zinc-300 text-sm font-medium">{item.label}</span>
                            </div>

                            <span className="font-bold text-zinc-100 text-sm">
                                {item.value}
                            </span>
                        </div>
                    );
                })}
                {data.length === 0 && (
                    <p className="text-sm text-zinc-500">No fleet stats found.</p>
                )}
            </div>
        </div>
    );
};

export default FleetStatus;