import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
    CalendarIcon,
    Search,
    MapPin,
    CalendarDays
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const locations = [
    "Ahmedabad",
    "Surat",
    "Rajkot",
    "Vadodara",
    "Mumbai",
    "Delhi",
];

export default function SearchBar() {
    const navigate = useNavigate();
    const [pickupLocation, setPickupLocation] = useState(localStorage.getItem("pickupLocation") || "");
    const [pickupDate, setPickupDate] = useState(() => {
        const stored = localStorage.getItem("pickupDate");
        return stored ? new Date(stored) : new Date();
    });
    const [returnDate, setReturnDate] = useState(() => {
        const stored = localStorage.getItem("returnDate");
        return stored ? new Date(stored) : new Date(Date.now() + 86400000);
    });

    const handleSearch = () => {
        localStorage.setItem("pickupLocation", pickupLocation);
        localStorage.setItem("pickupDate", format(pickupDate, "yyyy-MM-dd"));
        localStorage.setItem("returnDate", format(returnDate, "yyyy-MM-dd"));

        if (pickupLocation) {
            navigate(`/cars?search=${encodeURIComponent(pickupLocation)}`);
        } else {
            navigate(`/cars`);
        }
    };

    return (
        <div className="w-full max-w-5xl bg-white border border-slate-100 rounded-2xl md:rounded-full shadow-2xl p-4 md:py-3 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-4 items-center">
                {/* Pickup Location */}
                <div className="flex items-center gap-3 px-3 py-2 md:py-0 border-b md:border-b-0 md:border-r border-slate-150">
                    <MapPin className="text-indigo-600 shrink-0" size={20} />
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Pickup Location
                        </label>
                        <select
                            className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer focus:text-indigo-600"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                        >
                            <option value="">Select location</option>
                            {locations.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Pickup Date */}
                <div className="flex items-center gap-3 px-3 py-2 md:py-0 border-b md:border-b-0 md:border-r border-slate-150">
                    <CalendarDays className="text-indigo-600 shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Pick-Up Date
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="mt-1 w-full text-left text-sm font-semibold text-slate-800 outline-none cursor-pointer flex items-center justify-between hover:text-indigo-600">
                                    <span className="truncate">
                                        {format(pickupDate, "dd MMM yyyy")}
                                    </span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white shadow-xl border border-slate-100 rounded-xl" align="start">
                                <Calendar
                                    mode="single"
                                    selected={pickupDate}
                                    onSelect={(date) => date && setPickupDate(date)}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Return Date */}
                <div className="flex items-center gap-3 px-3 py-2 md:py-0 border-b md:border-b-0 border-slate-150">
                    <CalendarDays className="text-indigo-600 shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Return Date
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="mt-1 w-full text-left text-sm font-semibold text-slate-800 outline-none cursor-pointer flex items-center justify-between hover:text-indigo-600">
                                    <span className="truncate">
                                        {format(returnDate, "dd MMM yyyy")}
                                    </span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white shadow-xl border border-slate-100 rounded-xl" align="start">
                                <Calendar
                                    mode="single"
                                    selected={returnDate}
                                    onSelect={(date) => date && setReturnDate(date)}
                                    disabled={(date) => date < pickupDate}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Search Button */}
                <div className="px-3 md:px-0">
                    <Button
                        onClick={handleSearch}
                        className="w-full md:w-auto h-12 md:h-14 rounded-full text-base font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer px-6 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Search className="h-5 w-5" />
                        Search Cars
                    </Button>
                </div>
            </div>
        </div>
    );
}