import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { featureSchema } from "@/validation/featureSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Wifi, Shield, Zap, Compass, Wind, Music, Sun, Key, MapPin, Snowflake, Heart } from "lucide-react";

// List of pre-supported Lucide icons with their actual components
const POPULAR_ICONS = [
    { name: "Wifi", component: Wifi, label: "Wi-Fi" },
    { name: "Shield", component: Shield, label: "Safety" },
    { name: "Zap", component: Zap, label: "Electric" },
    { name: "Compass", component: Compass, label: "GPS" },
    { name: "Wind", component: Wind, label: "A/C" },
    { name: "Music", component: Music, label: "Audio" },
    { name: "Sun", component: Sun, label: "Sunroof" },
    { name: "Key", component: Key, label: "Keyless" },
    { name: "MapPin", component: MapPin, label: "Tracking" },
    { name: "Snowflake", component: Snowflake, label: "Heated" },
    { name: "Heart", component: Heart, label: "Comfort" },
];

export default function FeatureForm({ initialData = null, onSubmit, onCancel, isLoading = false }) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(featureSchema),
        defaultValues: {
            name: initialData?.name || "",
            icon: initialData?.icon || "Zap",
            description: initialData?.description || "",
            isActive: initialData !== null ? initialData.isActive : true,
        },
    });

    const activeIcon = watch("icon");
    const isActiveValue = watch("isActive");

    const selectIcon = (iconName) => {
        setValue("icon", iconName);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-zinc-100">
            <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-zinc-300 block">Feature Name</label>
                <Input
                    placeholder="e.g. WiFi, Sunroof, Leather Seats"
                    className="h-11 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-sky-500 focus:border-sky-500 rounded-lg transition-all duration-200"
                    {...register("name")}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-zinc-300 block">Select Icon Representation</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/80">
                    {POPULAR_ICONS.map((ico) => {
                        const IconComp = ico.component;
                        const isSelected = activeIcon === ico.name;
                        return (
                            <button
                                key={ico.name}
                                type="button"
                                onClick={() => selectIcon(ico.name)}
                                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border text-center transition-all duration-200 cursor-pointer ${
                                    isSelected
                                        ? "bg-sky-500/10 border-sky-500 text-sky-400 font-semibold"
                                        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                <IconComp className="h-5 w-5" />
                                <span className="text-[10px] truncate max-w-full">{ico.label}</span>
                            </button>
                        );
                    })}
                </div>
                {errors.icon && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.icon.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-zinc-300 block">Description (Optional)</label>
                <Textarea
                    placeholder="Describe what comfort or feature this represents..."
                    rows={3}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-sky-500 focus:border-sky-500 rounded-lg transition-all duration-200 resize-none"
                    {...register("description")}
                />
                {errors.description && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.description.message}</p>}
            </div>

            <div className="flex items-center space-x-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
                <Checkbox
                    id="isActive"
                    checked={isActiveValue}
                    onCheckedChange={(checked) => setValue("isActive", checked)}
                    className="border-zinc-700 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                />
                <div className="grid gap-1.5 leading-none">
                    <label htmlFor="isActive" className="text-sm font-semibold tracking-wide text-zinc-300 cursor-pointer select-none">
                        Active Feature
                    </label>
                    <p className="text-xs text-zinc-500">Only active features will be selectable when listing new cars.</p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={onCancel}
                        className="h-11 border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg font-semibold"
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-sky-500/20 active:scale-[0.98] transition-all duration-200"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                        </span>
                    ) : initialData ? (
                        "Save Changes"
                    ) : (
                        "Create Feature"
                    )}
                </Button>
            </div>
        </form>
    );
}
