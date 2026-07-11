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
        } catch (err) { }
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
        } catch (err) { }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const renderBookingRow = (booking) => (
        <TableRow
            key={booking._id}
            className="border-b border-border hover:bg-accent/50 transition-colors"
        >
            <TableCell className="py-3 font-semibold text-foreground font-mono text-xs">
                {booking.bookingNumber}
            </TableCell>

            <TableCell className="py-3">
                <div className="text-sm font-semibold text-foreground">
                    {booking.user?.name || "N/A"}
                </div>
                <div className="text-xs text-muted-foreground">
                    {booking.user?.email || "N/A"}
                </div>
            </TableCell>

            <TableCell className="py-3">
                <div className="text-sm font-semibold text-foreground">
                    {booking.car?.name || "N/A"}
                </div>
                <div className="text-xs text-muted-foreground">
                    {booking.car?.registrationNumber || ""}
                </div>
            </TableCell>

            <TableCell className="py-3 text-xs text-muted-foreground">
                <div>{formatDate(booking.pickupDate)}</div>
                <div className="text-[10px] text-muted-foreground/80">
                    to {formatDate(booking.returnDate)}
                </div>
            </TableCell>

            <TableCell className="py-3 font-semibold text-foreground text-xs">
                <div className="flex items-center">
                    <IndianRupee className="h-3 w-3 mr-0.5 text-muted-foreground" />
                    {booking.totalAmount?.toLocaleString()}
                </div>
            </TableCell>

            <TableCell className="py-3 text-xs text-muted-foreground">
                <div>{booking.paymentMethod}</div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">
                    {booking.payment?.status || "Pending"}
                </div>
            </TableCell>

            <TableCell className="py-3">
                <StatusBadge
                    status={booking.bookingStatus}
                    type="booking-status"
                />
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

                                const formatted = pDate
                                    .toISOString()
                                    .slice(0, 16);

                                setPickupDateTime(formatted);
                            }}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-8 px-2.5 font-semibold text-xs gap-1"
                        >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                        </Button>

                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setRejectingBooking(booking)}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg h-8 px-2.5 font-semibold text-xs gap-1"
                        >
                            <X className="h-3.5 w-3.5" />
                            Reject
                        </Button>
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground font-medium">
                        No actions
                    </span>
                )}
            </TableCell>
        </TableRow>
    );

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Reservations Management
                </h1>

                <p className="text-sm text-muted-foreground">
                    Review and manage customer car bookings, approve cash bookings, or reject cancellations.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilterChange}
                >
                    <SelectTrigger className="w-[160px] h-10 bg-background border-border text-foreground rounded-lg text-xs">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>

                    <SelectContent className="bg-popover border-border text-popover-foreground">
                        <SelectItem value="all">
                            All Statuses
                        </SelectItem>

                        {[
                            "Pending",
                            "Confirmed",
                            "Picked Up",
                            "Completed",
                            "Cancelled",
                        ].map((st) => (
                            <SelectItem key={st} value={st}>
                                {st}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <MasterTable
                headers={[
                    "Booking ID",
                    "Customer",
                    "Car",
                    "Dates",
                    "Amount",
                    "Payment",
                    "Status",
                    "Actions",
                ]}
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

            <Dialog
                open={!!approvingBooking}
                onOpenChange={(open) => !open && setApprovingBooking(null)}
            >
                <DialogContent className="bg-card border-border text-card-foreground max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-bold text-lg">
                            Approve Reservation
                        </DialogTitle>

                        <DialogDescription className="text-muted-foreground text-sm">
                            Confirm the customer's cash reservation details and log specifications.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground">
                                Assign Pickup Date & Time
                            </label>

                            <Input
                                type="datetime-local"
                                value={pickupDateTime}
                                onChange={(e) =>
                                    setPickupDateTime(e.target.value)
                                }
                                className="bg-background border-border text-foreground h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground">
                                Confirmation Note (Optional)
                            </label>

                            <Input
                                placeholder="e.g. Car will be cleaned and ready"
                                value={confirmationNote}
                                onChange={(e) =>
                                    setConfirmationNote(e.target.value)
                                }
                                className="bg-background border-border text-foreground h-11"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setApprovingBooking(null)}
                            className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleApproveSubmit}
                            disabled={!pickupDateTime || isConfirming}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
                        >
                            {isConfirming ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Confirm Approval"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!rejectingBooking}
                onOpenChange={(open) => !open && setRejectingBooking(null)}
            >
                <DialogContent className="bg-card border-border text-card-foreground max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-foreground font-bold text-lg">
                            Reject Reservation
                        </DialogTitle>

                        <DialogDescription className="text-muted-foreground text-sm">
                            Please provide a reason for rejecting this booking request.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground">
                                Reason for Rejection
                            </label>

                            <Input
                                placeholder="e.g. Vehicle requires urgent maintenance"
                                value={rejectionReason}
                                onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                }
                                className="bg-background border-border text-foreground h-11"
                            />

                            {rejectionReason &&
                                rejectionReason.length < 5 && (
                                    <p className="text-xs text-destructive">
                                        Reason must be at least 5 characters.
                                    </p>
                                )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setRejectingBooking(null)}
                            className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleRejectSubmit}
                            disabled={
                                !rejectionReason ||
                                rejectionReason.length < 5 ||
                                isRejecting
                            }
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold rounded-lg"
                        >
                            {isRejecting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Reject Booking"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
