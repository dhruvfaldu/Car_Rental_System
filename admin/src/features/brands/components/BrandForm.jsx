import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandSchema } from "@/validation/brandSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, X } from "lucide-react";

export default function BrandForm({ initialData = null, onSubmit, onCancel, isLoading = false }) {
    const [logoPreview, setLogoPreview] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: initialData?.name || "",
            isActive: initialData !== null ? initialData.isActive : true,
            logo: undefined,
        },
    });

    const isActiveValue = watch("isActive");

    useEffect(() => {
        if (initialData?.logo?.secure_url) {
            setLogoPreview(initialData.logo.secure_url);
        }
    }, [initialData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue("logo", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearLogo = () => {
        setValue("logo", undefined);
        setLogoPreview(null);
        const fileInput = document.getElementById("logo-input");
        if (fileInput) fileInput.value = "";
    };

    const handleFormSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("isActive", data.isActive);
        if (data.logo) {
            formData.append("logo", data.logo);
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-semibold tracking-wide text-foreground">
                    Brand Name
                </label>

                <Input
                    placeholder="e.g. BMW, Tesla, Toyota"
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
                    Logo
                </label>

                {logoPreview ? (
                    <div className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-2">
                        <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-h-full max-w-full object-contain"
                        />

                        <button
                            type="button"
                            onClick={clearLogo}
                            className="absolute top-1.5 right-1.5 rounded-full bg-background/90 p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <label className="group flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-all duration-200 hover:border-primary hover:bg-muted">
                        <div className="flex flex-col items-center justify-center py-6">
                            <Upload className="mb-2 h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />

                            <p className="text-xs font-medium text-muted-foreground">
                                Click to upload brand logo
                            </p>

                            <p className="mt-1 text-[10px] text-muted-foreground">
                                PNG, JPG, SVG up to 5MB
                            </p>
                        </div>

                        <input
                            id="logo-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
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
                        Active Brand
                    </label>

                    <p className="text-xs text-muted-foreground">
                        Inactive brands will not be visible in frontend filters.
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
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </span>
                    ) : initialData ? (
                        "Save Changes"
                    ) : (
                        "Create Brand"
                    )}
                </Button>
            </div>
        </form>
    );
}
