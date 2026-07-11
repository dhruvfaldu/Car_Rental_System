import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carSchema } from "@/validation/carSchema";
import { useBrands } from "../../brands/hooks/useBrands";
import { useCategories } from "../../categories/hooks/useCategories";
import { useFeatures } from "../../features/hooks/useFeatures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";

export default function CarForm({ initialData = null, onSubmit, onCancel, isLoading = false }) {
    const { brands } = useBrands();
    const { categories } = useCategories();
    const { features } = useFeatures();

    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(carSchema),
        defaultValues: {
            name: initialData?.name || "",
            brand: initialData?.brand?._id || initialData?.brand || "",
            category: initialData?.category?._id || initialData?.category || "",
            year: initialData?.year || new Date().getFullYear(),
            fuelType: initialData?.fuelType || "Petrol",
            transmission: initialData?.transmission || "Manual",
            seats: initialData?.seats || 5,
            registrationNumber: initialData?.registrationNumber || "",
            pricePerDay: initialData?.pricePerDay || "",
            description: initialData?.description || "",
            isFeatured: initialData?.isFeatured || false,
            status: initialData?.status || "Available",
            isActive: initialData !== null ? initialData.isActive : true,
        },
    });

    const isFeaturedValue = watch("isFeatured");
    const isActiveValue = watch("isActive");
    const brandValue = watch("brand");
    const categoryValue = watch("category");
    const statusValue = watch("status");
    const fuelValue = watch("fuelType");
    const transmissionValue = watch("transmission");

    useEffect(() => {
        if (initialData) {
            if (initialData.features) {
                const ids = initialData.features.map(f => f._id || f);
                setSelectedFeatures(ids);
            }
            if (initialData.images) {
                setExistingImages(initialData.images);
            }
        }
    }, [initialData]);

    const handleFeatureChange = (featureId, checked) => {
        if (checked) {
            setSelectedFeatures(prev => [...prev, featureId]);
        } else {
            setSelectedFeatures(prev => prev.filter(id => id !== featureId));
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const totalImagesCount = existingImages.length - deletedImages.length + newImages.length + files.length;
        if (totalImagesCount > 5) {
            alert("Maximum 5 images allowed per car");
            return;
        }

        setNewImages(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImagePreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (publicId) => {
        setDeletedImages(prev => [...prev, publicId]);
    };

    const undoRemoveExistingImage = (publicId) => {
        setDeletedImages(prev => prev.filter(id => id !== publicId));
    };

    const handleFormSubmit = (data) => {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        selectedFeatures.forEach(featId => {
            formData.append("features[]", featId);
        });

        newImages.forEach(file => {
            formData.append("images", file);
        });

        deletedImages.forEach(pubId => {
            formData.append("deletedImages", pubId);
        });

        onSubmit(formData);
    };

    const activeBrands = brands.filter(b => b.isActive || b._id === initialData?.brand?._id);
    const activeCategories = categories.filter(c => c.isActive || c._id === initialData?.category?._id);
    const activeFeatures = features.filter(f => f.isActive || selectedFeatures.includes(f._id));

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6 text-foreground max-h-[75vh] overflow-y-auto pr-2"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-foreground">
                        Car Name
                    </label>
                    <Input
                        placeholder="e.g. Fortuner, Model S"
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-foreground">
                        Registration Number
                    </label>
                    <Input
                        placeholder="e.g. MH12AB1234"
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11 uppercase"
                        {...register("registrationNumber")}
                    />
                    {errors.registrationNumber && (
                        <p className="text-xs text-destructive">
                            {errors.registrationNumber.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-foreground">
                        Brand
                    </label>
                    <Select
                        value={brandValue}
                        onValueChange={(val) => setValue("brand", val)}
                    >
                        <SelectTrigger className="bg-background border-border text-foreground rounded-lg h-11">
                            <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>

                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            {activeBrands.map((b) => (
                                <SelectItem key={b._id} value={b._id}>
                                    {b.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {errors.brand && (
                        <p className="text-xs text-destructive">
                            {errors.brand.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-foreground">
                        Category
                    </label>

                    <Select
                        value={categoryValue}
                        onValueChange={(val) => setValue("category", val)}
                    >
                        <SelectTrigger className="bg-background border-border text-foreground rounded-lg h-11">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>

                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            {activeCategories.map((c) => (
                                <SelectItem key={c._id} value={c._id}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {errors.category && (
                        <p className="text-xs text-destructive">
                            {errors.category.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-foreground">
                        Year
                    </label>

                    <Input
                        type="number"
                        placeholder="2026"
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11"
                        {...register("year")}
                    />

                    {errors.year && (
                        <p className="text-xs text-destructive">
                            {errors.year.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-foreground">
                        Seats Capacity
                    </label>

                    <Input
                        type="number"
                        placeholder="5"
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11"
                        {...register("seats")}
                    />

                    {errors.seats && (
                        <p className="text-xs text-destructive">
                            {errors.seats.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-foreground">
                        Fuel Type
                    </label>

                    <Select
                        value={fuelValue}
                        onValueChange={(val) => setValue("fuelType", val)}
                    >
                        <SelectTrigger className="bg-background border-border text-foreground rounded-lg h-11">
                            <SelectValue placeholder="Select Fuel Type" />
                        </SelectTrigger>

                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            {["Petrol", "Diesel", "Electric", "Hybrid", "CNG"].map(
                                (fuel) => (
                                    <SelectItem key={fuel} value={fuel}>
                                        {fuel}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    {errors.fuelType && (
                        <p className="text-xs text-destructive">
                            {errors.fuelType.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-foreground">
                        Transmission
                    </label>

                    <Select
                        value={transmissionValue}
                        onValueChange={(val) => setValue("transmission", val)}
                    >
                        <SelectTrigger className="bg-background border-border text-foreground rounded-lg h-11">
                            <SelectValue placeholder="Select Transmission" />
                        </SelectTrigger>

                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            {["Manual", "Automatic"].map((t) => (
                                <SelectItem key={t} value={t}>
                                    {t}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {errors.transmission && (
                        <p className="text-xs text-destructive">
                            {errors.transmission.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-foreground">
                        Price Per Day (₹)
                    </label>

                    <Input
                        type="number"
                        placeholder="₹2500"
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-lg h-11"
                        {...register("pricePerDay")}
                    />

                    {errors.pricePerDay && (
                        <p className="text-xs text-destructive">
                            {errors.pricePerDay.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-foreground">
                        Rental Status
                    </label>

                    <Select
                        value={statusValue}
                        onValueChange={(val) => setValue("status", val)}
                    >
                        <SelectTrigger className="bg-background border-border text-foreground rounded-lg h-11">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>

                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            {["Available", "Booked", "Rented", "Maintenance"].map(
                                (status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    {errors.status && (
                        <p className="text-xs text-destructive">
                            {errors.status.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide text-foreground">
                    Description
                </label>

                <Textarea
                    placeholder="Provide description highlights, comfort options, engine size details..."
                    rows={3}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground rounded-lg resize-none"
                    {...register("description")}
                />
            </div>

            <div className="space-y-2.5">
                <label className="text-xs font-semibold tracking-wide text-foreground block">
                    Select Features
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-muted/40 p-4 rounded-xl border border-border max-h-48 overflow-y-auto">
                    {activeFeatures.map((f) => (
                        <div
                            key={f._id}
                            className="flex items-center space-x-2.5"
                        >
                            <Checkbox
                                id={`feat-${f._id}`}
                                checked={selectedFeatures.includes(f._id)}
                                onCheckedChange={(checked) =>
                                    handleFeatureChange(f._id, checked)
                                }
                                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />

                            <label
                                htmlFor={`feat-${f._id}`}
                                className="text-xs text-foreground select-none cursor-pointer"
                            >
                                {f.name}
                            </label>
                        </div>
                    ))}

                    {activeFeatures.length === 0 && (
                        <p className="text-xs text-muted-foreground col-span-full">
                            No active features found.
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wide text-foreground block">
                    Vehicle Images (Max 5)
                </label>

                {existingImages.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                            Existing Images
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {existingImages.map((img) => {
                                const isDeleted = deletedImages.includes(img.public_id);

                                return (
                                    <div
                                        key={img.public_id}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center p-1.5 ${isDeleted
                                                ? "opacity-30 border-destructive/50"
                                                : ""
                                            }`}
                                    >
                                        <img
                                            src={img.secure_url}
                                            alt="Car"
                                            className="max-w-full max-h-full object-contain"
                                        />

                                        {isDeleted ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    undoRemoveExistingImage(
                                                        img.public_id
                                                    )
                                                }
                                                className="absolute inset-0 bg-background/70 text-destructive font-semibold text-[10px] flex items-center justify-center hover:text-primary"
                                            >
                                                Undo
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeExistingImage(img.public_id)
                                                }
                                                className="absolute top-1 right-1 p-0.5 bg-background/80 rounded-full hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {newImagePreviews.map((preview, index) => (
                        <div
                            key={index}
                            className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center p-1.5"
                        >
                            <img
                                src={preview}
                                alt="New upload"
                                className="max-w-full max-h-full object-contain"
                            />

                            <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute top-1 right-1 p-0.5 bg-background/80 rounded-full hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}

                    {existingImages.length - deletedImages.length + newImages.length <
                        5 && (
                            <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-border hover:border-primary bg-muted/30 rounded-lg cursor-pointer transition-all hover:bg-accent">
                                <Upload className="h-4 w-4 text-muted-foreground" />
                                <span className="text-[9px] text-muted-foreground mt-1 font-medium">
                                    Upload
                                </span>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-muted/40 p-4 rounded-xl border border-border">
                    <Checkbox
                        id="isFeatured"
                        checked={isFeaturedValue}
                        onCheckedChange={(checked) =>
                            setValue("isFeatured", checked)
                        }
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />

                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="isFeatured"
                            className="text-sm font-semibold tracking-wide text-foreground cursor-pointer select-none"
                        >
                            Featured Car
                        </label>

                        <p className="text-[11px] text-muted-foreground">
                            Show this car on the homepage featured section.
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 bg-muted/40 p-4 rounded-xl border border-border">
                    <Checkbox
                        id="isActive"
                        checked={isActiveValue}
                        onCheckedChange={(checked) =>
                            setValue("isActive", checked)
                        }
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />

                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="isActive"
                            className="text-sm font-semibold tracking-wide text-foreground cursor-pointer select-none"
                        >
                            Active Listing
                        </label>

                        <p className="text-[11px] text-muted-foreground">
                            Make this car visible to customers.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={onCancel}
                        className="h-11 border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg font-semibold"
                    >
                        Cancel
                    </Button>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </span>
                    ) : initialData ? (
                        "Save Changes"
                    ) : (
                        "Create Car"
                    )}
                </Button>
            </div>
        </form>
    );
}
