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
            <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    {onSearchChange && (
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="h-10 rounded-lg border-input bg-background pl-9 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                            />
                        </div>
                    )}

                    {filterComponent}
                </div>

                {addButton && <div className="shrink-0">{addButton}</div>}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <Table>
                    <TableHeader className="border-b border-border bg-muted/40">
                        <TableRow className="border-b border-border hover:bg-transparent">
                            {headers.map((header, idx) => (
                                <TableHead
                                    key={idx}
                                    className="h-auto py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                                >
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, rIdx) => (
                                <TableRow key={rIdx} className="border-b border-border">
                                    {headers.map((_, cIdx) => (
                                        <TableCell key={cIdx} className="py-4">
                                            <Skeleton className="h-5 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={headers.length}
                                    className="h-32 py-10 text-center text-sm font-medium text-muted-foreground"
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

            {/* Pagination */}
            {totalPages > 1 && onPageChange && (
                <div className="flex items-center justify-between px-2 py-2">
                    <p className="text-xs font-medium text-muted-foreground">
                        Page{" "}
                        <span className="font-semibold text-foreground">
                            {currentPage}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-foreground">
                            {totalPages}
                        </span>
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1 || isLoading}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="h-8"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages || isLoading}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="h-8"
                        >
                            Next
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
