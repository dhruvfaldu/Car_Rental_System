import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import CarFilters from "./CarFilters";

export default function FilterDrawer() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-11 border-slate-200">
                    <SlidersHorizontal size={16} />
                    Filter & Sort Vehicles
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md p-0 overflow-y-auto bg-slate-50">
                <SheetHeader className="p-6 bg-white border-b border-slate-100">
                    <SheetTitle className="text-xl font-bold">Filters</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                    <CarFilters />
                </div>
            </SheetContent>
        </Sheet>
    );
}
