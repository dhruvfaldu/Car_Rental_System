import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/validation/categorySchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, X } from "lucide-react";

export default function CategoryForm({ initialData = null, onSubmit, onCancel, isLoading = false }) {
    const [imagePreview, setImagePreview] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            isActive: initialData !== null ? initialData.isActive : true,
            image: undefined,
        },
    });

    const isActiveValue = watch("isActive");

    useEffect(() => {
        if (initialData?.image?.secure_url) {
            setImagePreview(initialData.image.secure_url);
        }
    }, [initialData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setValue("image", undefined);
        setImagePreview(null);
        const fileInput = document.getElementById("category-image-input");
        if (fileInput) fileInput.value = "";
    };

    const handleFormSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("isActive", data.isActive);
        if (data.image) {
            formData.append("image", data.image);
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 text-zinc-100">
            <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-zinc-300 block">Category Name</label>
                <Input
                    placeholder="e.g. SUV, Sedan, Hatchback, Luxury"
                    className="h-11 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-sky-500 focus:border-sky-500 rounded-lg transition-all duration-200"
                    {...register("name")}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-zinc-300 block">Description (Optional)</label>
                <Textarea
                    placeholder="Provide a brief description of this vehicle category..."
                    rows={3}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-sky-500 focus:border-sky-500 rounded-lg transition-all duration-200 resize-none"
                    {...register("description")}
                />
                {errors.description && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-zinc-300 block">Display Image</label>
                {imagePreview ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center p-2 group">
                        <img src={imagePreview} alt="Category preview" className="max-w-full max-h-full object-contain" />
                        <button
                            type="button"
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-1 bg-zinc-900/80 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 hover:border-sky-500/50 bg-zinc-900/30 hover:bg-zinc-900/50 rounded-xl cursor-pointer transition-all duration-200 group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-8 w-8 text-zinc-500 group-hover:text-sky-400 mb-2 transition-colors" />
                            <p className="text-xs text-zinc-400 font-medium">Click to upload category image</p>
                            <p className="text-[10px] text-zinc-600 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                        <input id="category-image-input" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                )}
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
                        Active Category
                    </label>
                    <p className="text-xs text-zinc-500">Only active categories will be shown as vehicle options for users.</p>
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
                        "Create Category"
                    )}
                </Button>
            </div>
        </form>
    );
}
