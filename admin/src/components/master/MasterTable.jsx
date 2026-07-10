import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function MasterTable({
    headers = [],
    data = [],
    isLoading = false,
    searchQuery = "",
    onSearchChange,
    searchPlaceholder = "Search...",
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    renderRow,
    emptyMessage = "No records found.",
    addButton,
    filterComponent,
}) {
    return (
        <div className="space-y-4">
            {/* Header controls: Search & Filters & Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {onSearchChange && (
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-9 h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-sky-500 focus:border-sky-500 rounded-lg"
                            />
                        </div>
                    )}
                    {filterComponent}
                </div>
                {addButton && <div className="shrink-0">{addButton}</div>}
            </div>

            {/* Glassmorphic Table Container */}
            <div className="overflow-hidden border border-zinc-800/80 rounded-xl bg-zinc-900/40 backdrop-blur-md">
                <Table>
                    <TableHeader className="bg-zinc-950/80 border-b border-zinc-800">
                        <TableRow className="hover:bg-transparent border-b border-zinc-800">
                            {headers.map((header, idx) => (
                                <TableHead
                                    key={idx}
                                    className="text-xs font-bold uppercase tracking-wider text-zinc-400 py-3.5 h-auto"
                                >
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Render Skeleton rows while loading
                            Array.from({ length: 5 }).map((_, rIdx) => (
                                <TableRow key={rIdx} className="border-b border-zinc-800/50">
                                    {headers.map((_, cIdx) => (
                                        <TableCell key={cIdx} className="py-4">
                                            <Skeleton className="h-5 w-full bg-zinc-800/50" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={headers.length}
                                    className="h-32 text-center text-zinc-500 text-sm font-medium py-10"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, idx) => renderRow(item, idx))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && onPageChange && (
                <div className="flex items-center justify-between px-2 py-2">
                    <p className="text-xs text-zinc-500 font-medium">
                        Page <span className="text-zinc-300 font-semibold">{currentPage}</span> of{" "}
                        <span className="text-zinc-300 font-semibold">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1 || isLoading}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="h-8 border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages || isLoading}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="h-8 border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
