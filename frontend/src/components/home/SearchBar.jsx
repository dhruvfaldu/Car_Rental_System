import { useState } from "react";
import { format } from "date-fns";

import {
    CalendarIcon,
    Search,
    ChevronDown,
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
    const [pickupLocation, setPickupLocation] = useState("");

    const [pickupDate, setPickupDate] = useState(new Date());

    const [returnDate, setReturnDate] = useState(
        new Date(Date.now() + 86400000)
    );

    return (
        <>
            <div className="flex items-center justify-center ">
                <div className="flex flex-col items-center justify-center gap-14 h-screen">
                    <h1 className="text-4xl font-semibold">
                        Luxury cars on Rent
                    </h1>

                    <div className=" flex items-center justify-between mx-auto  max-w-5xl rounded-full bg-white shadow-xl px-10 py-5">

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 items-center">

                            {/* Pickup Location */}
                            <div>
                                <p className="font-semibold flex items-center gap-1">
                                    Pickup Location
                                    <ChevronDown size={16} />
                                </p>

                                <select
                                    className="mt-2 w-full bg-transparent text-muted-foreground outline-none"
                                    value={pickupLocation}
                                    onChange={(e) => setPickupLocation(e.target.value)}
                                >
                                    <option value="">
                                        Please select location
                                    </option>

                                    {locations.map((city) => (
                                        <option
                                            key={city}
                                            value={city}
                                        >
                                            {city}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            {/* Pickup Date */}

                            <div>
                                <p className="font-semibold">
                                    Pick-up Date
                                </p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="mt-2 w-full justify-between p-0 font-normal"
                                        >
                                            {format(pickupDate, "dd-MM-yyyy")}

                                            <CalendarIcon size={18} />

                                        </Button>

                                    </PopoverTrigger>

                                    <PopoverContent className="w-auto p-0">

                                        <Calendar
                                            mode="single"
                                            selected={pickupDate}
                                            onSelect={setPickupDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Return Date */}
                            <div>
                                <p className="font-semibold">
                                    Return Date
                                </p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="mt-2 w-full justify-between p-0 font-normal"
                                        >
                                            {format(returnDate, "dd-MM-yyyy")}
                                            <CalendarIcon size={18} />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-auto p-0">

                                        <Calendar
                                            mode="single"
                                            selected={returnDate}
                                            onSelect={setReturnDate}
                                            disabled={(date) =>
                                                date < pickupDate
                                            }
                                        />

                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        {/* Search Button */}

                        <Button
                            className="h-14 rounded-full text-base"
                        >
                            <Search className="mr-2 h-5 w-5" />
                            Search
                        </Button>

                    </div>
                    <div className="max-h-74">
                        <img src="src/assets/main_car.png" alt="Car Image" />
                    </div>
                </div>

            </div>
        </>
    );
}