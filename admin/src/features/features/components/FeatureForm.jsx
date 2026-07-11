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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
                <label className="block text-sm font-semibold tracking-wide text-foreground">
                    Feature Name
                </label>

                <Input
                    placeholder="e.g. WiFi, Sunroof, Leather Seats"
                    className="h-11 rounded-lg border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                    {...register("name")}
                />

                {errors.name && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-semibold tracking-wide text-foreground">
                    Select Icon Representation
                </label>

                <div className="grid grid-cols-4 gap-2 rounded-xl border border-border bg-muted/40 p-3 sm:grid-cols-6">
                    {POPULAR_ICONS.map((ico) => {
                        const IconComp = ico.component;
                        const isSelected = activeIcon === ico.name;

                        return (
                            <button
                                key={ico.name}
                                type="button"
                                onClick={() => selectIcon(ico.name)}
                                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-all duration-200 ${isSelected
                                        ? "border-primary bg-primary/10 text-primary font-semibold"
                                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                    }`}
                            >
                                <IconComp className="h-5 w-5" />
                                <span className="max-w-full truncate text-[10px]">
                                    {ico.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {errors.icon && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                        {errors.icon.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-semibold tracking-wide text-foreground">
                    Description (Optional)
                </label>

                <Textarea
                    placeholder="Describe what comfort or feature this represents..."
                    rows={3}
                    className="resize-none rounded-lg border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                    {...register("description")}
                />

                {errors.description && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="flex items-center space-x-3 rounded-xl border border-border bg-muted/40 p-4">
                <Checkbox
                    id="isActive"
                    checked={isActiveValue}
                    onCheckedChange={(checked) => setValue("isActive", checked)}
                    className="border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />

                <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor="isActive"
                        className="cursor-pointer select-none text-sm font-semibold tracking-wide text-foreground"
                    >
                        Active Feature
                    </label>

                    <p className="text-xs text-muted-foreground">
                        Only active features will be selectable when listing new cars.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={onCancel}
                        className="h-11 rounded-lg"
                    >
                        Cancel
                    </Button>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 rounded-lg bg-primary text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
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
