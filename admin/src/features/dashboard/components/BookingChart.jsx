import React from "react";

const BookingChart = ({ data = [] }) => {
    // Find the max value to scale bar heights
    const maxCount = Math.max(...data.map(item => item.value), 1);

    return (
        <div className="rounded-2xl border border-zinc-850 bg-zinc-900/40 border-zinc-800 backdrop-blur-md p-6 shadow-sm">
            <h2 className="mb-6 text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                Booking Status Overview
            </h2>

            <div className="flex items-end gap-4 h-64 pt-6 pb-2 px-2 sm:px-8 border-b border-zinc-800/80">
                {data.map((item) => {
                    const percentage = (item.value / maxCount) * 100;
                    
                    let barColor = "from-sky-500 to-indigo-600 shadow-sky-500/10";
                    if (item.label === "Completed") barColor = "from-emerald-500 to-teal-600 shadow-emerald-500/10";
                    else if (item.label === "Pending") barColor = "from-amber-500 to-orange-600 shadow-amber-500/10";
                    else if (item.label === "Cancelled") barColor = "from-rose-500 to-red-600 shadow-rose-500/10";
                    else if (item.label === "Picked Up") barColor = "from-purple-500 to-indigo-600 shadow-purple-500/10";

                    return (
                        <div key={item.id} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                            <div className="text-zinc-200 text-xs font-bold">{item.value}</div>
                            
                            <div
                                style={{ height: `${Math.max(percentage, 6)}%` }}
                                className={`w-full max-w-[48px] rounded-t-lg bg-gradient-to-t ${barColor} shadow-lg transition-all duration-700 ease-out`}
                            />
                            
                            <div className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wider text-center truncate max-w-full mt-1">
                                {item.label}
                            </div>
                        </div>
                    );
                })}
                {data.length === 0 && (
                    <div className="flex-1 flex items-center justify-center h-full text-zinc-500 text-sm">
                        No bookings found to map stats.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingChart;