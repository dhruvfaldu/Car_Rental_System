import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/loginSchema";
import { useLogin } from "../hook/useLogin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const LoginForm = () => {
    const { login, isLoading } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        await login(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-zinc-300 block">
                    Email Address
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                        <Mail className="h-5 w-5" />
                    </span>
                    <Input
                        type="email"
                        placeholder="admin@carrental.com"
                        className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-sky-500 focus:border-sky-500 rounded-lg transition-all duration-200"
                        {...register("email")}
                    />
                </div>
                {errors.email && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold tracking-wide text-zinc-300 block">
                        Password
                    </label>
                </div>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                        <Lock className="h-5 w-5" />
                    </span>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-11 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-sky-500 focus:border-sky-500 rounded-lg transition-all duration-200"
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 animate-in fade-in zoom-in duration-200" />
                        ) : (
                            <Eye className="h-5 w-5 animate-in fade-in zoom-in duration-200" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                variant="default"
                size="lg"
                className="w-full h-11 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-sky-500/20 active:scale-[0.98] transition-all duration-200"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Authenticating...
                    </div>
                ) : (
                    "Sign In"
                )}
            </Button>
        </form>
    );
};

export default LoginForm;
