import { Mail, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/schemas/auth.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import PasswordInput from "./PasswordInput";
import { useLoginMutation } from "@/features/auth/useAuthQuery";

export default function LoginForm() {


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),

        defaultValues: {
            email: "",
            password: "",
        },
    });

    const loginMutation = useLoginMutation();


    const onSubmit = async (data) => {
        console.log(data);

        loginMutation.mutate(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
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
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 pl-10"
                        {...register("email")}
                    />
                </div>

                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password */}

            <PasswordInput
                label="Password"
                placeholder="Enter your password"
                register={register("password")}
                error={errors.password?.message}
            />

            {/* Forgot Password */}

            <div className="flex justify-end">
                <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                >
                    Forgot Password?
                </Link>
            </div>

            {/* Login Button */}

            <Button
                type="submit"
                className="h-12 w-full"
                disabled={isSubmitting}
            >
                <LogIn className="mr-2 h-4 w-4" />

                {isSubmitting ? "Signing In..." : "Login"}
            </Button>

            {/* Register Link */}

            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                    to="/register"
                    className="font-semibold text-primary hover:underline"
                >
                    Register
                </Link>
            </p>
        </form>
    );
}