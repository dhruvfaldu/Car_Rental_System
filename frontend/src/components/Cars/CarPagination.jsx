import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CarPagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="rounded-lg h-10 w-10 border-slate-200"
            >
                <ChevronLeft size={18} />
            </Button>

            {pages.map((p) => (
                <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    onClick={() => onPageChange(p)}
                    className={`rounded-lg h-10 w-10 font-bold ${
                        p === page ? "bg-primary text-white" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                >
                    {p}
                </Button>
            ))}

            <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="rounded-lg h-10 w-10 border-slate-200"
            >
                <ChevronRight size={18} />
            </Button>
        </div>
    );
}
