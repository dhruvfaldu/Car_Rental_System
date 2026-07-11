import React from "react";

const FleetStatus = ({ data = [] }) => {
    return (
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-md">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
                Fleet Distribution
            </h2>

            <div className="space-y-4">
                {data.map((item) => {
                    let color = "bg-muted";

                    if (item.label === "Available") color = "bg-chart-1";
                    else if (item.label === "Booked") color = "bg-chart-2";
                    else if (item.label === "Rented") color = "bg-chart-5";
                    else if (item.label === "Maintenance") color = "bg-destructive";

                    return (
                        <div
                            key={item.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${color}`}
                                />
                                <span className="text-sm font-medium text-foreground">
                                    {item.label}
                                </span>
                            </div>

                            <span className="text-sm font-bold text-foreground">
                                {item.value}
                            </span>
                        </div>
                    );
                })}

                {data.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No fleet stats found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default FleetStatus;