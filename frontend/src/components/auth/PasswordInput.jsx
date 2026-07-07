import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function PasswordInput({
    register,
    error,
    label,
    placeholder,
}) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label className="mb-2 block text-sm font-medium">
                {label}
            </label>

            <div className="relative">
                <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                    {...register}
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    className="h-12 pl-10 pr-10"
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}