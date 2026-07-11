import React from "react";
import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status, type = "default" }) {
    let style = "bg-muted text-muted-foreground border-border";

    if (type === "active") {
        const isActive = !!status;

        style = isActive
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-border bg-muted text-muted-foreground";

        return (
            <Badge
                variant="outline"
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${style}`}
            >
                {isActive ? "Active" : "Inactive"}
            </Badge>
        );
    }

    if (type === "car-status") {
        switch (status) {
            case "Available":
                style =
                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                break;

            case "Booked":
                style =
                    "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
                break;

            case "Rented":
                style =
                    "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
                break;

            case "Maintenance":
                style =
                    "border-destructive/20 bg-destructive/10 text-destructive";
                break;

            default:
                style = "bg-muted text-muted-foreground border-border";
        }
    }

    return (
        <Badge
            variant="outline"
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${style}`}
        >
            {status}
        </Badge>
    );
}