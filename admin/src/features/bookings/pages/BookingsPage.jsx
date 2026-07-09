import React, { useState } from "react";
import { useBookings } from "../hooks/useBookings";
import MasterTable from "@/components/master/MasterTable";
import StatusBadge from "@/components/master/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableRow, TableCell } from "@/components/ui/table";
import { Check, X, IndianRupee, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export default function BookingsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const queryParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        bookingStatus: statusFilter !== "all" ? statusFilter : undefined,
    };

    const {
        bookings,
        pagination,
        isLoading,
        confirmBooking,
        isConfirming,
        rejectBooking,
        isRejecting,
    } = useBookings(queryParams);

    const [approvingBooking, setApprovingBooking] = useState(null);
    const [rejectingBooking, setRejectingBooking] = useState(null);

    const [pickupDateTime, setPickupDateTime] = useState("");
    const [confirmationNote, setConfirmationNote] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (val) => {
        setStatusFilter(val);
        setCurrentPage(1);
    };

    const handleApproveSubmit = async () => {
        if (!pickupDateTime) return;
        try {
            await confirmBooking({
                bookingId: approvingBooking._id,
                pickupDateTime,
                confirmationNote,
            });
            setApprovingBooking(null);
            setPickupDateTime("");
            setConfirmationNote("");
        } catch (err) {}
    };

    const handleRejectSubmit = async () => {
        if (!rejectionReason || rejectionReason.length < 5) return;
        try {
            await rejectBooking({
                bookingId: rejectingBooking._id,
                rejectionReason,
            });
            setRejectingBooking(null);
            setRejectionReason("");
        } catch (err) {}
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const renderBookingRow = (booking) => (
        <TableRow key={booking._id} className="border-b border-zinc-800/50 hover:bg-zinc-900/20 transition-colors">
            <TableCell className="py-3 font-semibold text-zinc-300 font-mono text-xs">
                {booking.bookingNumber}
            </TableCell>
            <TableCell className="py-3">
                <div className="text-sm font-semibold text-zinc-200">{booking.user?.name || "N/A"}</div>
                <div className="text-xs text-zinc-500">{booking.user?.email || "N/A"}</div>
            </TableCell>
            <TableCell className="py-3">
                <div className="text-sm font-semibold text-zinc-200">{booking.car?.name || "N/A"}</div>
                <div className="text-xs text-zinc-505">{booking.car?.registrationNumber || ""}</div>
            </TableCell>
            <TableCell className="py-3 text-xs text-zinc-400">
                <div>{formatDate(booking.pickupDate)}</div>
                <div className="text-[10px] text-zinc-600">to {formatDate(booking.returnDate)}</div>
            </TableCell>
            <TableCell className="py-3 font-semibold text-zinc-200 text-xs">
                <div className="flex items-center">
                    <IndianRupee className="h-3 w-3 mr-0.5 text-zinc-400" />
                    {booking.totalAmount?.toLocaleString()}
                </div>
            </TableCell>
            <TableCell className="py-3 text-xs text-zinc-400">
                <div>{booking.paymentMethod}</div>
                <div className="text-[10px] uppercase font-bold text-zinc-500 mt-0.5">
                    {booking.payment?.status || "Pending"}
                </div>
            </TableCell>
            <TableCell className="py-3">
                <StatusBadge status={booking.bookingStatus} type="booking-status" />
            </TableCell>
            <TableCell className="py-3">
                {booking.bookingStatus === "Pending" ? (
                    <div className="flex items-center gap-1.5">
                        <Button
                            size="sm"
                            onClick={() => {
                                setApprovingBooking(booking);
                                const pDate = new Date(booking.pickupDate);
                                pDate.setHours(10, 0, 0, 0);
                                const formatted = pDate.toISOString().slice(0, 16);
                                setPickupDateTime(formatted);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg h-8 px-2.5 font-semibold text-xs gap-1"
                        >
                            <Check className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setRejectingBooking(booking)}
                            className="bg-rose-600 hover:bg-rose-500 text-white rounded-lg h-8 px-2.5 font-semibold text-xs gap-1"
                        >
                            <X className="h-3.5 w-3.5" /> Reject
                        </Button>
                    </div>
                ) : (
                    <span className="text-xs text-zinc-600 font-medium">No actions</span>
                )}
            </TableCell>
        </TableRow>
    );

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
                    Reservations Management
                </h1>
                <p className="text-sm text-zinc-400">
                    Review and manage customer car bookings, approve cash bookings, or reject cancellations.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-[160px] h-10 bg-zinc-900/50 border-zinc-800 text-zinc-300 rounded-lg text-xs">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="all">All Statuses</SelectItem>
                        {["Pending", "Confirmed", "Picked Up", "Completed", "Cancelled"].map(st => (
                            <SelectItem key={st} value={st}>{st}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <MasterTable
                headers={["Booking ID", "Customer", "Car", "Dates", "Amount", "Payment", "Status", "Actions"]}
                data={bookings}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search by booking number..."
                currentPage={pagination.page || currentPage}
                totalPages={pagination.totalPages || 1}
                onPageChange={setCurrentPage}
                renderRow={renderBookingRow}
                emptyMessage="No reservations matches found."
            />

            <Dialog open={!!approvingBooking} onOpenChange={(open) => !open && setApprovingBooking(null)}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100 font-bold text-lg">Approve Reservation</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-sm">
                            Confirm the customer's cash reservation details and log specifications.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-300">Assign Pickup Date & Time</label>
                            <Input
                                type="datetime-local"
                                value={pickupDateTime}
                                onChange={(e) => setPickupDateTime(e.target.value)}
                                className="bg-zinc-950 border-zinc-800 text-zinc-150 h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-300">Confirmation Note (Optional)</label>
                            <Input
                                placeholder="e.g. Car will be cleaned and ready"
                                value={confirmationNote}
                                onChange={(e) => setConfirmationNote(e.target.value)}
                                className="bg-zinc-950 border-zinc-800 text-zinc-150 h-11"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setApprovingBooking(null)}
                            className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApproveSubmit}
                            disabled={!pickupDateTime || isConfirming}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg"
                        >
                            {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Approval"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!rejectingBooking} onOpenChange={(open) => !open && setRejectingBooking(null)}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100 font-bold text-lg">Reject Reservation</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-sm">
                            Please provide a reason for rejecting this booking request.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-300">Reason for Rejection</label>
                            <Input
                                placeholder="e.g. Vehicle requires urgent maintenance"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="bg-zinc-950 border-zinc-800 text-zinc-150 h-11"
                            />
                            {rejectionReason && rejectionReason.length < 5 && (
                                <p className="text-xs text-rose-500">Reason must be at least 5 characters.</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setRejectingBooking(null)}
                            className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRejectSubmit}
                            disabled={!rejectionReason || rejectionReason.length < 5 || isRejecting}
                            className="bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow-lg"
                        >
                            {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject Booking"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
