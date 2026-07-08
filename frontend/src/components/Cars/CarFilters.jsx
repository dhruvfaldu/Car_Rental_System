import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";

import {
    brands,
    categories,
    fuelTypes,
    transmissions,
    seats,
} from "@/constants/carFilters";

export default function CarFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Local state for text search input
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

    // Local state for price range
    const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 10000);

    // Synchronize local search text and price with URL when URL changes (e.g. on Reset)
    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
        setMaxPrice(Number(searchParams.get("maxPrice")) || 10000);
    }, [searchParams]);

    // General updater helper
    const updateQueryParam = (key, value) => {
        const nextParams = new URLSearchParams(searchParams);
        if (value) {
            nextParams.set(key, value);
        } else {
            nextParams.delete(key);
        }
        nextParams.set("page", "1"); // Reset to page 1 on filter change
        setSearchParams(nextParams);
    };

    // Handler for Search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateQueryParam("search", searchQuery);
    };

    // Checkbox toggling helper
    const handleCheckboxGroupChange = (paramKey, itemValue, isChecked) => {
        const nextParams = new URLSearchParams(searchParams);
        const currentParam = nextParams.get(paramKey);
        let activeItems = currentParam ? currentParam.split(",") : [];

        if (isChecked) {
            if (!activeItems.includes(itemValue)) {
                activeItems.push(itemValue);
            }
        } else {
            activeItems = activeItems.filter((i) => i !== itemValue);
        }

        if (activeItems.length > 0) {
            nextParams.set(paramKey, activeItems.join(","));
        } else {
            nextParams.delete(paramKey);
        }
        nextParams.set("page", "1");
        setSearchParams(nextParams);
    };

    const isCheckboxChecked = (paramKey, itemValue) => {
        const currentParam = searchParams.get(paramKey);
        if (!currentParam) return false;
        return currentParam.split(",").includes(itemValue);
    };

    const handleReset = () => {
        setSearchParams({});
    };

    return (
        <Card className="sticky top-24 space-y-6 p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Filters</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs font-semibold text-slate-500 hover:text-primary p-0 h-auto"
                >
                    Reset All
                </Button>
            </div>

            {/* <Separator className="bg-slate-100" /> */}

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cars..."
                    className="pl-10 h-10 border-slate-200 focus-visible:ring-primary rounded-xl"
                />
            </form>

            {/* Brand */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Brand</label>
                <Select
                    value={searchParams.get("brand") || "all-brands"}
                    onValueChange={(val) => updateQueryParam("brand", val === "all-brands" ? "" : val)}
                >
                    <SelectTrigger className="w-full h-10 border-slate-200 rounded-xl focus:ring-primary text-sm font-medium">
                        <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-brands">All Brands</SelectItem>
                        {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                                {brand}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <Select
                    value={searchParams.get("category") || "all-categories"}
                    onValueChange={(val) => updateQueryParam("category", val === "all-categories" ? "" : val)}
                >
                    <SelectTrigger className="w-full h-10 border-slate-200 rounded-xl focus:ring-primary text-sm font-medium">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-categories">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Fuel */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700">Fuel Type</h3>
                <div className="space-y-2.5">
                    {fuelTypes.map((fuel) => (
                        <div key={fuel} className="flex items-center gap-2">
                            <Checkbox
                                id={`fuel-${fuel}`}
                                checked={isCheckboxChecked("fuelType", fuel)}
                                onCheckedChange={(checked) => handleCheckboxGroupChange("fuelType", fuel, checked)}
                                className="rounded border-slate-300 data-[state=checked]:bg-primary"
                            />
                            <label htmlFor={`fuel-${fuel}`} className="text-sm text-slate-600 font-medium select-none cursor-pointer">
                                {fuel}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transmission */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700">Transmission</h3>
                <div className="space-y-2.5">
                    {transmissions.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                            <Checkbox
                                id={`trans-${item}`}
                                checked={isCheckboxChecked("transmission", item)}
                                onCheckedChange={(checked) => handleCheckboxGroupChange("transmission", item, checked)}
                                className="rounded border-slate-300 data-[state=checked]:bg-primary"
                            />
                            <label htmlFor={`trans-${item}`} className="text-sm text-slate-600 font-medium select-none cursor-pointer">
                                {item}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Seats */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700">Seats</h3>
                <RadioGroup
                    value={searchParams.get("seats") || "all-seats"}
                    onValueChange={(val) => updateQueryParam("seats", val === "all-seats" ? "" : val)}
                    className="space-y-2"
                >
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="all-seats" id="seats-all" className="border-slate-300 text-primary focus:ring-primary" />
                        <label htmlFor="seats-all" className="text-sm text-slate-600 font-medium select-none cursor-pointer">Any Capacity</label>
                    </div>
                    {seats.map((seat) => (
                        <div key={seat} className="flex items-center gap-2">
                            <RadioGroupItem value={seat.toString()} id={`seats-${seat}`} className="border-slate-300 text-primary focus:ring-primary" />
                            <label htmlFor={`seats-${seat}`} className="text-sm text-slate-600 font-medium select-none cursor-pointer">{seat} Seats</label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Price */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700">Max Price Per Day</h3>
                <Slider
                    value={[maxPrice]}
                    max={10000}
                    min={500}
                    step={500}
                    onValueChange={(val) => setMaxPrice(val[0])}
                    onValueCommit={(val) => updateQueryParam("maxPrice", val[0].toString())}
                    className="py-1 cursor-pointer text-primary"
                />
                <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>₹500</span>
                    <span className="text-primary font-extrabold bg-primary/10 px-2.5 py-0.5 rounded-full">₹{maxPrice.toLocaleString()}</span>
                    <span>₹10,000</span>
                </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Sort By</label>
                <Select
                    value={searchParams.get("sort") || "newest"}
                    onValueChange={(val) => updateQueryParam("sort", val)}
                >
                    <SelectTrigger className="w-full h-10 border-slate-200 rounded-xl focus:ring-primary text-sm font-medium">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest Listed</SelectItem>
                        <SelectItem value="pricePerDay">Price: Low to High</SelectItem>
                        <SelectItem value="-pricePerDay">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </Card>
    );
}