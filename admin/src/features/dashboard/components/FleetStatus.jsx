import { fleetStatus } from "../data/dashboardData";

const FleetStatus = () => {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold">
                Fleet Status
            </h2>

            <div className="space-y-4">
                {fleetStatus.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className={`h-3 w-3 rounded-full ${item.color}`}
                            />

                            <span>{item.label}</span>
                        </div>

                        <span className="font-semibold">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FleetStatus;