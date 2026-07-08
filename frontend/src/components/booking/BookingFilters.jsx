import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function BookingFilters() {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">

            <div className="grid gap-4 lg:grid-cols-4">

                {/* Search */}

                <div className="relative">

                    <Search
                        className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                    />

                    <Input
                        placeholder="Search booking..."
                        className="pl-9"
                    />

                </div>

                {/* Status */}

                <Select>

                    <SelectTrigger>

                        <SelectValue placeholder="Booking Status" />

                    </SelectTrigger>

                    <SelectContent>

                        <SelectItem value="all">
                            All
                        </SelectItem>

                        <SelectItem value="active">
                            Active
                        </SelectItem>

                        <SelectItem value="upcoming">
                            Upcoming
                        </SelectItem>

                        <SelectItem value="completed">
                            Completed
                        </SelectItem>

                        <SelectItem value="cancelled">
                            Cancelled
                        </SelectItem>

                    </SelectContent>

                </Select>

                {/* Sort */}

                <Select>

                    <SelectTrigger>

                        <SelectValue placeholder="Sort By" />

                    </SelectTrigger>

                    <SelectContent>

                        <SelectItem value="latest">
                            Latest
                        </SelectItem>

                        <SelectItem value="oldest">
                            Oldest
                        </SelectItem>

                        <SelectItem value="price-high">
                            Price: High → Low
                        </SelectItem>

                        <SelectItem value="price-low">
                            Price: Low → High
                        </SelectItem>

                    </SelectContent>

                </Select>

                {/* Filter Button */}

                <Button className="w-full">
                    Apply Filters
                </Button>

            </div>

        </div>
    );
}