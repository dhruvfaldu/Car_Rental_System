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
        <div className="space-y-6 text-zinc-100">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Renter Profile</h3>
                    <p className="text-sm text-zinc-400">Manage your credentials and contact information.</p>
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
                        className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-750 text-zinc-300 font-semibold gap-1.5 h-10 text-xs rounded-lg"
                    >
                        <Edit2 size={13} />
                        Edit Profile
                    </Button>
                )}
            </div>

            {!isEditing ? (
                <div className="grid gap-6">
                    <Card className="border-zinc-800 bg-zinc-900/10 backdrop-blur-md">
                        <CardContent className="p-6 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold border border-zinc-800">
                                    {user.name ? user.name[0].toUpperCase() : "U"}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-zinc-200">{user.name}</h4>
                                    <span className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                        {user.role} Member
                                    </span>
                                </div>
                            </div>

                            <hr className="border-zinc-800" />

                            <div className="grid gap-4 sm:grid-cols-2 text-sm">
                                <ProfileDetailItem
                                    icon={<Mail className="h-4.5 w-4.5 text-zinc-500" />}
                                    label="Email Address"
                                    value={user.email}
                                />
                                <ProfileDetailItem
                                    icon={<Phone className="h-4.5 w-4.5 text-zinc-500" />}
                                    label="Phone Number"
                                    value={user.phone || "—"}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Card className="border-zinc-800 bg-zinc-900/10 backdrop-blur-md p-6">
                        <CardContent className="p-0 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Full Name</Label>
                                    <Input
                                        className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-zinc-150 h-11"
                                        placeholder="Enter full name"
                                        {...register("name")}
                                    />
                                    {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</Label>
                                    <Input
                                        className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-zinc-150 h-11"
                                        placeholder="name@example.com"
                                        {...register("email")}
                                    />
                                    {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Phone Number</Label>
                                    <Input
                                        className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-zinc-150 h-11"
                                        placeholder="Phone number"
                                        {...register("phone")}
                                    />
                                    {errors.phone && <p className="text-xs text-rose-500">{errors.phone.message}</p>}
                                </div>
                            </div>

                            <hr className="border-zinc-800 my-4" />
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pb-1">Change Password (Optional)</h4>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Current Password</Label>
                                    <Input
                                        type="password"
                                        className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-zinc-150 h-11"
                                        placeholder="Enter current password"
                                        {...register("currentPassword")}
                                    />
                                    {errors.currentPassword && <p className="text-xs text-rose-500">{errors.currentPassword.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">New Password</Label>
                                    <Input
                                        type="password"
                                        className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-zinc-150 h-11"
                                        placeholder="Enter new password"
                                        {...register("newPassword")}
                                    />
                                    {errors.newPassword && <p className="text-xs text-rose-500">{errors.newPassword.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="h-11 border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg text-xs font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="h-11 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:shadow-sky-500/10 transition-all text-xs"
                        >
                            {updateProfileMutation.isPending ? (
                                <span className="flex items-center gap-1.5">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
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
        <div className="flex items-start gap-3 bg-zinc-950/40 p-4 rounded-xl border border-zinc-805 border-zinc-800/80">
            <div className="mt-0.5">{icon}</div>
            <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{label}</p>
                <p className="font-semibold text-zinc-300 mt-0.5">{value}</p>
            </div>
        </div>
    );
}
