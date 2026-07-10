import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateProfileMutation } from "@/features/auth/useAuthQuery";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, Lock, Edit2, ShieldAlert, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
    if (data.newPassword && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
});

export default function Profile() {
    const { user } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);

    const updateProfileMutation = useUpdateProfileMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            currentPassword: "",
            newPassword: "",
        },
    });

    const onSubmit = async (values) => {
        const payload = {
            name: values.name,
            email: values.email,
            phone: values.phone,
        };

        if (values.currentPassword && values.newPassword) {
            payload.currentPassword = values.currentPassword;
            payload.password = values.newPassword;
        }

        try {
            await updateProfileMutation.mutateAsync(payload);
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            reset({
                name: values.name,
                email: values.email,
                phone: values.phone,
                currentPassword: "",
                newPassword: "",
            });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update profile.");
        }
    };

    if (!user) {
        return (
            <div className="flex h-48 items-center justify-center text-zinc-400">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                        Renter Profile
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your credentials and contact information.
                    </p>
                </div>

                {!isEditing && (
                    <Button
                        onClick={() => {
                            setIsEditing(true);
                            reset({
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                                currentPassword: "",
                                newPassword: "",
                            });
                        }}
                        className="h-10 gap-1.5 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                        <Edit2 size={14} />
                        Edit Profile
                    </Button>
                )}
            </div>

            {!isEditing ? (
                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="space-y-5 p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                {user.name ? user.name[0].toUpperCase() : "U"}
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-card-foreground">
                                    {user.name}
                                </h4>

                                <span className="rounded-md bg-accent px-2 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                                    {user.role} Member
                                </span>
                            </div>
                        </div>

                        <hr className="border-border" />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <ProfileDetailItem
                                icon={
                                    <Mail className="h-4.5 w-4.5 text-muted-foreground" />
                                }
                                label="Email Address"
                                value={user.email}
                            />

                            <ProfileDetailItem
                                icon={
                                    <Phone className="h-4.5 w-4.5 text-muted-foreground" />
                                }
                                label="Phone Number"
                                value={user.phone || "—"}
                            />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <Card className="border-border bg-card shadow-sm">
                        <CardContent className="space-y-5 p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Full Name
                                    </Label>

                                    <Input
                                        {...register("name")}
                                        placeholder="Enter full name"
                                        className="h-11 border-input bg-background"
                                    />

                                    {errors.name && (
                                        <p className="text-xs text-destructive">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Email Address
                                    </Label>

                                    <Input
                                        {...register("email")}
                                        placeholder="name@example.com"
                                        className="h-11 border-input bg-background"
                                    />

                                    {errors.email && (
                                        <p className="text-xs text-destructive">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Phone Number
                                    </Label>

                                    <Input
                                        {...register("phone")}
                                        placeholder="Phone Number"
                                        className="h-11 border-input bg-background"
                                    />

                                    {errors.phone && (
                                        <p className="text-xs text-destructive">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <hr className="border-border" />

                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Change Password (Optional)
                            </h4>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Current Password
                                    </Label>

                                    <Input
                                        type="password"
                                        {...register("currentPassword")}
                                        placeholder="Current Password"
                                        className="h-11 border-input bg-background"
                                    />

                                    {errors.currentPassword && (
                                        <p className="text-xs text-destructive">
                                            {errors.currentPassword.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        New Password
                                    </Label>

                                    <Input
                                        type="password"
                                        {...register("newPassword")}
                                        placeholder="New Password"
                                        className="h-11 border-input bg-background"
                                    />

                                    {errors.newPassword && (
                                        <p className="text-xs text-destructive">
                                            {errors.newPassword.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="h-11"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="h-11 bg-primary text-primary-foreground hover:opacity-90"
                        >
                            {updateProfileMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                "Save Profile"
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}

function ProfileDetailItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
            <div className="mt-0.5 text-muted-foreground">{icon}</div>

            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="mt-0.5 font-semibold text-foreground">{value}</p>
            </div>
        </div>
    );
}
