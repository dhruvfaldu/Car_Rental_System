import React, { useState } from "react";
import { useInvoices } from "../hooks/useInvoices";
import MasterTable from "@/components/master/MasterTable";
import StatusBadge from "@/components/master/StatusBadge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileText, IndianRupee, Eye, Download, CreditCard, Loader2 } from "lucide-react";
import api from "@/api/axios";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export default function InvoicesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const { invoices, isLoadingAll, payInvoice, isPaying } = useInvoices();

    // Selected Invoice ID for details dialog
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const { invoiceDetails, isLoadingDetails } = useInvoices(selectedInvoiceId);

    // Payment recording states
    const [paymentAmount, setPaymentAmount] = useState("");

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (val) => {
        setStatusFilter(val);
        setCurrentPage(1);
    };

    // Client-side filtering & searching
    const filteredInvoices = invoices.filter((inv) => {
        const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
        
        const customerName = inv.customer?.name || "";
        const invoiceNum = inv.invoiceNumber || "";
        const bookingNum = inv.booking?.bookingNumber || "";
        
        const matchesSearch =
            customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoiceNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookingNum.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePdfDownload = async (id, invoiceNumber) => {
        try {
            const response = await api.get(`/invoices/${id}/pdf`, {
                responseType: "blob",
            });
            const blob = new Blob([response.data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `Invoice-${invoiceNumber}.pdf`;
            link.click();
            window.URL.revokeObjectURL(link.href);
            toast.success("PDF Downloaded successfully!");
        } catch (err) {
            toast.error("Failed to download invoice PDF");
        }
    };

    const handleRecordPayment = async () => {
        if (!paymentAmount || Number(paymentAmount) <= 0) {
            toast.error("Please enter a valid positive payment amount.");
            return;
        }

        try {
            await payInvoice({
                id: selectedInvoiceId,
                amountPaid: Number(paymentAmount),
            });
            setPaymentAmount("");
        } catch (err) {}
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Paid":
                return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
            case "Pending":
                return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
            case "Refunded":
                return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
            default:
                return "border-zinc-500/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400";
        }
    };

    const headers = ["Invoice #", "Customer", "Booking Ref", "Grand Total", "Remaining", "Status", "Actions"];

    const renderRow = (inv) => {
        return (
            <TableRow key={inv._id} className="border-b border-border hover:bg-muted/30">
                <TableCell className="py-4 font-mono text-xs font-semibold text-foreground">
                    {inv.invoiceNumber}
                </TableCell>
                <TableCell className="py-4 text-foreground font-medium">
                    {inv.customer?.name || "—"}
                </TableCell>
                <TableCell className="py-4 font-mono text-xs text-muted-foreground">
                    {inv.booking?.bookingNumber || "—"}
                </TableCell>
                <TableCell className="py-4 text-foreground font-semibold">
                    ₹{inv.totalAmount?.toLocaleString()}
                </TableCell>
                <TableCell className="py-4 text-foreground">
                    ₹{inv.remainingAmount?.toLocaleString()}
                </TableCell>
                <TableCell className="py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${getStatusStyle(inv.status)}`}>
                        {inv.status}
                    </span>
                </TableCell>
                <TableCell className="py-4">
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-border hover:bg-muted gap-1 px-2.5"
                            onClick={() => {
                                setSelectedInvoiceId(inv._id);
                                setPaymentAmount("");
                            }}
                        >
                            <Eye className="h-3.5 w-3.5" />
                            View
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handlePdfDownload(inv._id, inv.invoiceNumber)}
                        >
                            <Download className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Invoices & Billing</h1>
                <p className="text-sm text-muted-foreground">
                    Monitor invoices, print PDFs, and settle customer balances.
                </p>
            </div>

            <MasterTable
                headers={headers}
                data={paginatedInvoices}
                isLoading={isLoadingAll}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search invoice #, customer name..."
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                renderRow={renderRow}
                emptyMessage="No invoices found matching query."
                filterComponent={
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Filter Status:</span>
                        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="h-10 w-[150px] border-input bg-background text-foreground">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border text-popover-foreground">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Refunded">Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                }
            />

            {/* Invoice Details Dialog */}
            <Dialog open={!!selectedInvoiceId} onOpenChange={() => setSelectedInvoiceId(null)}>
                <DialogContent className="border-border bg-card text-card-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-foreground">
                            <FileText className="h-5 w-5 text-primary" />
                            Invoice Invoice-{invoiceDetails?.invoiceNumber}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Detailed invoice summary and payment history.
                        </DialogDescription>
                    </DialogHeader>

                    {isLoadingDetails ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <p className="text-xs text-muted-foreground">Loading details...</p>
                        </div>
                    ) : invoiceDetails ? (
                        <div className="space-y-6 py-2">
                            {/* Top Info */}
                            <div className="grid grid-cols-2 gap-4 border-b border-border pb-4 text-xs">
                                <div>
                                    <h4 className="font-bold text-muted-foreground uppercase tracking-wider mb-1">Customer info</h4>
                                    <p className="font-semibold text-foreground">{invoiceDetails.customer?.name}</p>
                                    <p className="text-muted-foreground">{invoiceDetails.customer?.email}</p>
                                    <p className="text-muted-foreground">{invoiceDetails.customer?.phone || "No phone"}</p>
                                </div>
                                <div className="text-right">
                                    <h4 className="font-bold text-muted-foreground uppercase tracking-wider mb-1">Invoice Status</h4>
                                    <span className={`inline-block rounded-full border px-2.5 py-0.5 font-semibold uppercase tracking-wider ${getStatusStyle(invoiceDetails.status)}`}>
                                        {invoiceDetails.status}
                                    </span>
                                    <p className="text-muted-foreground mt-2">
                                        Date: {new Date(invoiceDetails.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Booking log details */}
                            {invoiceDetails.booking && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rental Log</h4>
                                    <div className="grid grid-cols-3 gap-2 text-xs bg-muted/30 border border-border p-3 rounded-lg">
                                        <div>
                                            <span className="text-muted-foreground block">Vehicle</span>
                                            <span className="font-medium text-foreground">{invoiceDetails.booking.car?.name || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Booking Ref</span>
                                            <span className="font-medium text-foreground font-mono">{invoiceDetails.booking.bookingNumber}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Rental Days</span>
                                            <span className="font-medium text-foreground">{invoiceDetails.booking.totalDays} days</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Checklist checklist */}
                            {(invoiceDetails.pickup || invoiceDetails.return) && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Checklists Information</h4>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        {invoiceDetails.pickup && (
                                            <div className="border border-border p-3 rounded-lg bg-muted/10">
                                                <span className="font-semibold text-foreground block border-b border-border pb-1 mb-1.5">Pickup Checklist</span>
                                                <p className="text-muted-foreground">Odometer: <strong className="text-foreground">{invoiceDetails.pickup.odometerStart} KM</strong></p>
                                                <p className="text-muted-foreground">Fuel Level: <strong className="text-foreground">{invoiceDetails.pickup.fuelLevel}%</strong></p>
                                            </div>
                                        )}
                                        {invoiceDetails.return && (
                                            <div className="border border-border p-3 rounded-lg bg-muted/10">
                                                <span className="font-semibold text-foreground block border-b border-border pb-1 mb-1.5">Return Checklist</span>
                                                <p className="text-muted-foreground">Odometer: <strong className="text-foreground">{invoiceDetails.return.odometerEnd} KM</strong></p>
                                                <p className="text-muted-foreground">Fuel Level: <strong className="text-foreground">{invoiceDetails.return.fuelLevel}%</strong></p>
                                                <p className="text-muted-foreground">Late Hours: <strong className="text-foreground">{invoiceDetails.return.lateHours} hrs</strong></p>
                                                <p className="text-muted-foreground">Extra KM: <strong className="text-foreground">{invoiceDetails.return.extraKM} KM</strong></p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Financial breakdown */}
                            <div className="space-y-2 border-t border-border pt-4">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Billing Breakdown</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Base Rental Subtotal</span>
                                        <span className="text-foreground font-semibold">₹{invoiceDetails.subtotal?.toLocaleString()}</span>
                                    </div>
                                    {invoiceDetails.extraCharges && (
                                        <>
                                            {invoiceDetails.extraCharges.lateFee > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Late Return Fee</span>
                                                    <span className="text-foreground">₹{invoiceDetails.extraCharges.lateFee?.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {invoiceDetails.extraCharges.extraKMFee > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Extra Distance Fee</span>
                                                    <span className="text-foreground">₹{invoiceDetails.extraCharges.extraKMFee?.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {invoiceDetails.extraCharges.fuelCharges > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Fuel Refilling Charges</span>
                                                    <span className="text-foreground">₹{invoiceDetails.extraCharges.fuelCharges?.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {invoiceDetails.extraCharges.cleaningCharges > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Cleaning Fee</span>
                                                    <span className="text-foreground">₹{invoiceDetails.extraCharges.cleaningCharges?.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {invoiceDetails.extraCharges.damageCharges > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-rose-500 font-medium">Damage Penalty Charges</span>
                                                    <span className="text-rose-600 dark:text-rose-400 font-semibold">₹{invoiceDetails.extraCharges.damageCharges?.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Goods & Services Tax (18%)</span>
                                        <span className="text-foreground">₹{invoiceDetails.tax?.toLocaleString()}</span>
                                    </div>
                                    {invoiceDetails.discount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-emerald-500 font-medium">Coupon/Loyalty Discount</span>
                                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">-₹{invoiceDetails.discount?.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <hr className="border-border border-dashed my-2" />
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-foreground">Grand Total</span>
                                        <span className="text-foreground">₹{invoiceDetails.totalAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Paid Amount</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">₹{invoiceDetails.totalPaid?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold bg-muted/40 p-2.5 rounded-lg border border-border">
                                        <span className="text-foreground">Remaining Balance</span>
                                        <span className="text-rose-600 dark:text-rose-400">₹{invoiceDetails.remainingAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Settle invoice action */}
                            {invoiceDetails.status !== "Paid" && (
                                <div className="border-t border-border pt-4 mt-2 space-y-3">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                        <CreditCard size={14} className="text-primary" />
                                        Record Customer Balance Payment
                                    </h4>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₹</span>
                                            <Input
                                                type="number"
                                                placeholder={`Enter amount (max ₹${invoiceDetails.remainingAmount})`}
                                                value={paymentAmount}
                                                onChange={(e) => setPaymentAmount(e.target.value)}
                                                className="pl-6 border-input bg-background text-foreground h-10"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleRecordPayment}
                                            disabled={isPaying}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 shrink-0 font-medium"
                                        >
                                            {isPaying ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Record Payment"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-xs text-muted-foreground py-6">Could not fetch invoice details.</p>
                    )}

                    <DialogFooter className="border-t border-border pt-3 mt-2">
                        <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted"
                            onClick={() => setSelectedInvoiceId(null)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
