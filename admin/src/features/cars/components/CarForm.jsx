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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 text-zinc-100 max-h-[75vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-zinc-300">Car Name</label>
                    <Input
                        placeholder="e.g. Fortuner, Model S"
                        className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg h-11"
                        {...register("name")}
                    />
                    {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-zinc-300">Registration Number</label>
                    <Input
                        placeholder="e.g. MH12AB1234"
                        className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg h-11 uppercase"
                        {...register("registrationNumber")}
                    />
                    {errors.registrationNumber && <p className="text-xs text-rose-500">{errors.registrationNumber.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-zinc-300">Brand</label>
                    <Select value={brandValue} onValueChange={(val) => setValue("brand", val)}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-lg h-11">
                            <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-905 border-zinc-800 text-zinc-100 bg-zinc-900">
                            {activeBrands.map(b => (
                                <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.brand && <p className="text-xs text-rose-500">{errors.brand.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-zinc-300">Category</label>
                    <Select value={categoryValue} onValueChange={(val) => setValue("category", val)}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-lg h-11">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-905 border-zinc-800 text-zinc-100 bg-zinc-900">
                            {activeCategories.map(c => (
                                <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && <p className="text-xs text-rose-500">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-zinc-300">Year</label>
                    <Input
                        type="number"
                        placeholder="2026"
                        className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg h-11"
                        {...register("year")}
                    />
                    {errors.year && <p className="text-xs text-rose-500">{errors.year.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-zinc-300">Seats Capacity</label>
                    <Input
                        type="number"
                        placeholder="5"
                        className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg h-11"
                        {...register("seats")}
                    />
                    {errors.seats && <p className="text-xs text-rose-500">{errors.seats.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-zinc-300">Fuel Type</label>
                    <Select value={fuelValue} onValueChange={(val) => setValue("fuelType", val)}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-lg h-11">
                            <SelectValue placeholder="Select Fuel Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-905 border-zinc-800 text-zinc-100 bg-zinc-900">
                            {["Petrol", "Diesel", "Electric", "Hybrid", "CNG"].map(fuel => (
                                <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.fuelType && <p className="text-xs text-rose-500">{errors.fuelType.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-zinc-300">Transmission</label>
                    <Select value={transmissionValue} onValueChange={(val) => setValue("transmission", val)}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-lg h-11">
                            <SelectValue placeholder="Select Transmission" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-905 border-zinc-800 text-zinc-100 bg-zinc-900">
                            {["Manual", "Automatic"].map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.transmission && <p className="text-xs text-rose-500">{errors.transmission.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-zinc-300">Price Per Day (₹)</label>
                    <Input
                        type="number"
                        placeholder="₹2500"
                        className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg h-11"
                        {...register("pricePerDay")}
                    />
                    {errors.pricePerDay && <p className="text-xs text-rose-500">{errors.pricePerDay.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-zinc-300">Rental Status</label>
                    <Select value={statusValue} onValueChange={(val) => setValue("status", val)}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-lg h-11">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-905 border-zinc-800 text-zinc-100 bg-zinc-900">
                            {["Available", "Booked", "Rented", "Maintenance"].map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.status && <p className="text-xs text-rose-500">{errors.status.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide text-zinc-300">Description</label>
                <Textarea
                    placeholder="Provide description highlights, comfort options, engine size details..."
                    rows={3}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg resize-none"
                    {...register("description")}
                />
            </div>

            <div className="space-y-2.5">
                <label className="text-xs font-semibold tracking-wide text-zinc-300 block">Select Features</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80 max-h-48 overflow-y-auto">
                    {activeFeatures.map(f => (
                        <div key={f._id} className="flex items-center space-x-2.5">
                            <Checkbox
                                id={`feat-${f._id}`}
                                checked={selectedFeatures.includes(f._id)}
                                onCheckedChange={(checked) => handleFeatureChange(f._id, checked)}
                                className="border-zinc-700 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                            />
                            <label htmlFor={`feat-${f._id}`} className="text-xs text-zinc-300 select-none cursor-pointer">
                                {f.name}
                            </label>
                        </div>
                    ))}
                    {activeFeatures.length === 0 && (
                        <p className="text-xs text-zinc-500 col-span-full">No active features found.</p>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wide text-zinc-300 block">Vehicle Images (Max 5)</label>
                
                {existingImages.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Existing Images</p>
                        <div className="flex flex-wrap gap-2">
                            {existingImages.map((img) => {
                                const isDeleted = deletedImages.includes(img.public_id);
                                return (
                                    <div key={img.public_id} className={`relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center p-1.5 ${isDeleted ? "opacity-30 border-rose-500/50" : ""}`}>
                                        <img src={img.secure_url} alt="Car" className="max-w-full max-h-full object-contain" />
                                        {isDeleted ? (
                                            <button
                                                type="button"
                                                onClick={() => undoRemoveExistingImage(img.public_id)}
                                                className="absolute inset-0 bg-zinc-950/70 text-rose-400 font-semibold text-[10px] flex items-center justify-center hover:text-sky-400"
                                            >
                                                Undo
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(img.public_id)}
                                                className="absolute top-1 right-1 p-0.5 bg-zinc-900/80 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
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
                        <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center p-1.5">
                            <img src={preview} alt="New upload" className="max-w-full max-h-full object-contain" />
                            <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute top-1 right-1 p-0.5 bg-zinc-900/80 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    {(existingImages.length - deletedImages.length + newImages.length) < 5 && (
                        <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-zinc-800 hover:border-sky-500/50 bg-zinc-900/30 rounded-lg cursor-pointer transition-all hover:bg-zinc-900/50">
                            <Upload className="h-4 w-4 text-zinc-500" />
                            <span className="text-[9px] text-zinc-500 mt-1 font-medium">Upload</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
                    <Checkbox
                        id="isFeatured"
                        checked={isFeaturedValue}
                        onCheckedChange={(checked) => setValue("isFeatured", checked)}
                        className="border-zinc-700 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                    />
                    <div className="grid gap-1.5 leading-none">
                        <label htmlFor="isFeatured" className="text-sm font-semibold tracking-wide text-zinc-300 cursor-pointer select-none">
                            Featured Car
                        </label>
                        <p className="text-[11px] text-zinc-500">Show this car in frontend home page slideshows.</p>
                    </div>
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
                            Active Listing
                        </label>
                        <p className="text-[11px] text-zinc-500">Set visibility of this car listing across client apps.</p>
                    </div>
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
                        "Create Car"
                    )}
                </Button>
            </div>
        </form>
    );
}
