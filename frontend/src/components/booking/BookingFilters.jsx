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
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (onApply) onApply();
                }}
                className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 items-end"
            >
                <div className="space-y-1.5 mb-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Search Reservation
                    </label>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                        <Input
                            placeholder="Search booking number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-background border-border text-foreground pl-9 pr-8 focus-visible:ring-ring transition-colors"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-full transition-colors"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Filter by Status
                    </label>

                    <Select
                        value={status || "all"}
                        onValueChange={(val) => setStatus(val === "all" ? "" : val)}
                    >
                        <SelectTrigger className="bg-background border-border text-foreground focus:ring-ring transition-colors">
                            <SelectValue placeholder="Booking Status" />
                        </SelectTrigger>

                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            <SelectItem value="all">All Bookings</SelectItem>
                            <SelectItem value="Pending">Pending Approval</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Picked Up">Active / Picked Up</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-row-reverse md:col-span-3 lg:col-span-2 mb-2 gap-3">
                    <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg transition-colors"
                    >
                        Apply Search
                    </Button>

                    {(search || status) && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onReset}
                            className="border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}