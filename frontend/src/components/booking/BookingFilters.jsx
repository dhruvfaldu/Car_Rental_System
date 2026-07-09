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
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5 shadow-sm">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (onApply) onApply();
                }}
                className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 items-end"
            >
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Search Reservation</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search booking number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-zinc-950 border-zinc-800 text-zinc-150 pl-9 pr-8 focus-visible:ring-zinc-700 transition-colors"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-zinc-500 hover:text-zinc-350 rounded-full"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Filter by Status</label>
                    <Select value={status || "all"} onValueChange={(val) => setStatus(val === "all" ? "" : val)}>
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-200 transition-colors focus:ring-zinc-700">
                            <SelectValue placeholder="Booking Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                            <SelectItem value="all">All Bookings</SelectItem>
                            <SelectItem value="Pending">Pending Approval</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Picked Up">Active / Picked Up</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-3">
                    <Button type="submit" className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold shadow-lg hover:shadow-sky-500/10 transition-colors">
                        Apply Search
                    </Button>
                    {(search || status) && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onReset}
                            className="border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}