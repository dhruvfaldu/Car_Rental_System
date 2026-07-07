import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({ message = "No vehicles found matching your criteria.", onReset }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <AlertCircle size={30} />
            </div>
            <div className="space-y-2 max-w-sm">
                <h3 className="text-lg font-bold text-slate-900">No Vehicles Found</h3>
                <p className="text-sm text-slate-500">{message}</p>
            </div>
            {onReset && (
                <Button onClick={onReset} variant="outline" className="px-6 rounded-full font-semibold">
                    Clear All Filters
                </Button>
            )}
        </div>
    );
}
