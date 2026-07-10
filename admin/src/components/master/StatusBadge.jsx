import React from "react";
import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status, type = "default" }) {
    let style = "bg-zinc-800 text-zinc-300 border-zinc-700";

    if (type === "active") {
        const isActive = !!status;
        style = isActive
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
        return (
            <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${style}`}>
                {isActive ? "Active" : "Inactive"}
            </Badge>
        );
    }

    if (type === "car-status") {
        switch (status) {
            case "Available":
                style = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                break;
            case "Booked":
                style = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                break;
            case "Rented":
                style = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                break;
            case "Maintenance":
                style = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                break;
            default:
                break;
        }
    }

    return (
        <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${style}`}>
            {status}
        </Badge>
    );
}
