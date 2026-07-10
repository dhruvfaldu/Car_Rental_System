import React from "react";

const BookingChart = ({ data = [] }) => {
    // Find the max value to scale bar heights
    const maxCount = Math.max(...data.map(item => item.value), 1);

    return (
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-md">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
                Booking Status Overview
            </h2>

            <div className="flex h-64 items-end gap-3 border-b border-border ">
                {data.map((item) => {
                    const percentage = (item.value / maxCount) * 100;

                    let barColor = "from-chart-2 to-primary";
                    let shadowColor = "shadow-primary/15";

                    if (item.label === "Completed") {
                        barColor = "from-chart-1 to-chart-1";
                        shadowColor = "shadow-chart-1/20";
                    } else if (item.label === "Pending") {
                        barColor = "from-chart-5 to-chart-5";
                        shadowColor = "shadow-chart-5/20";
                    } else if (item.label === "Cancelled") {
                        barColor = "from-destructive to-destructive";
                        shadowColor = "shadow-destructive/20";
                    } else if (item.label === "Picked Up") {
                        barColor = "from-primary to-chart-2";
                        shadowColor = "shadow-primary/20";
                    }

                    return (
                        <div
                            key={item.id}
                            className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                        >
                            <div className="text-xs font-bold text-foreground">
                                {item.value}
                            </div>

                            <div
                                style={{
                                    height: `${Math.max(percentage, 6)}%`,
                                }}
                                className={`w-full max-w-[48px] rounded-t-lg bg-gradient-to-t ${barColor} ${shadowColor} shadow-lg transition-all duration-700 ease-out`}
                            />

                            <div className="mt-1 max-w-full truncate text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {item.label}
                            </div>
                        </div>
                    );
                })}

                {data.length === 0 && (
                    <div className="flex h-full flex-1 items-center justify-center text-sm text-muted-foreground">
                        No bookings found to map stats.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingChart;