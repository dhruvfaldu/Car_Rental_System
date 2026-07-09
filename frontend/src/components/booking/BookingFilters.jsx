import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function BookingFilters({
    search,
    setSearch,
    status,
    setStatus,
    onApply,
    onReset,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/50">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (onApply) onApply();
                }}
                className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 items-center"
            >
                {/* Search Input */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Reservation</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search booking number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-8 mb-1.5 border-slate-200 focus-visible:ring-indigo-600 hover:border-slate-350 transition-colors"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Dropdown */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter by Status</label>
                    <Select value={status} onValueChange={(val) => setStatus(val === "all" ? "" : val)}>
                        <SelectTrigger className="border-slate-200 hover:border-slate-350 transition-colors focus:ring-indigo-650">
                            <SelectValue placeholder="Booking Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Bookings</SelectItem>
                            <SelectItem value="Pending">Pending Awaiting Pay</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Picked Up">Active / Picked Up</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Filter and Clear Buttons */}
                <div className="flex-row-reverse md:col-span-1 lg:col-span-2 flex gap-3">
                    <Button type="submit" className=" bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-colors">
                        Apply Search
                    </Button>
                    {(search || status) && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onReset}
                            className="border-slate-200 text-slate-650 hover:bg-slate-50 transition-colors"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}