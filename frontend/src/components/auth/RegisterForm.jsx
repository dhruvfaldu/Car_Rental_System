import { User, Mail, Phone, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/schemas/auth.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import PasswordInput from "./PasswordInput";

import { useRegisterMutation } from "@/features/auth/useAuthQuery";

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useRegisterMutation();

    const onSubmit = (data) => {
        const userData = { ...data };
        delete userData.confirmPassword;
        console.log("User Data:", userData);
        registerMutation.mutate(userData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Full Name
                </label>

                <div className="relative">
                    <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        {...register("name")}
                        placeholder="John Doe"
                        className="h-12 pl-10"
                    />
                </div>

                {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Email
                </label>

                <div className="relative">
                    <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        {...register("email")}
                        placeholder="john@gmail.com"
                        className="h-12 pl-10"
                    />
                </div>

                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Phone */}
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Phone
                </label>

                <div className="relative">
                    <Phone
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        {...register("phone")}
                        placeholder="+91 9876543210"
                        className="h-12 pl-10"
                    />
                </div>

                {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <PasswordInput
                label="Password"
                placeholder="Enter password"
                register={register("password")}
                error={errors.password?.message}
            />

            {/* Confirm Password */}
            <PasswordInput
                label="Confirm Password"
                placeholder="Confirm password"
                register={register("confirmPassword")}
                error={errors.confirmPassword?.message}
            />

            <Button type="submit" className="h-12 w-full" disabled={registerMutation.isPending}>
                <UserPlus className="mr-2 h-4 w-4" />
                {registerMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                    href="/login"
                    className="font-medium text-primary hover:text-primary/80"
                >
                    Login
                </a>
            </p>
        </form>
    );
}