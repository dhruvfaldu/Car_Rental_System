import React, { useState } from "react";
import { useMyInvoicesQuery, usePayInvoiceMutation } from "@/features/invoices/useInvoices";
import { Loader2, AlertCircle, FileText, Download, CreditCard, Banknote, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

export default function Invoices() {
    const { data, isLoading, isError, refetch } = useMyInvoicesQuery();
    const payMutation = usePayInvoiceMutation();

    const invoices = data?.data || [];

    const [payingInvoice, setPayingInvoice] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("Online");

    const handlePaySubmit = async () => {
        try {
            await payMutation.mutateAsync({
                id: payingInvoice._id,
                amountPaid: payingInvoice.remainingAmount,
            });
            setPayingInvoice(null);
            refetch();
        } catch (err) { }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="border-b border-border pb-4">
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                    My Invoices
                </h3>
                <p className="text-sm text-muted-foreground">
                    Access your billing history, check balances, and download transaction PDFs.
                </p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20">
                    <Loader2 size={36} className="animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">
                        Retrieving invoices...
                    </p>
                </div>
            ) : isError ? (
                <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-3 py-12 text-center">
                    <AlertCircle size={36} className="text-destructive" />
                    <h4 className="text-base font-bold text-foreground">
                        Failed to load invoices
                    </h4>
                    <p className="text-xs text-muted-foreground">
                        We couldn't retrieve your invoice records. Please check backend
                        connection.
                    </p>

                    <Button
                        onClick={() => refetch()}
                        className="w-full bg-primary text-primary-foreground hover:opacity-90"
                    >
                        Try Again
                    </Button>
                </div>
            ) : invoices.length === 0 ? (
                <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />

                    <p className="text-xs text-muted-foreground">
                        No invoices generated yet. Invoices are created automatically
                        when rentals complete.
                    </p>
                </div>
            ) : (
                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border hover:bg-transparent">
                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Invoice #
                                    </TableHead>

                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Date
                                    </TableHead>

                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Total
                                    </TableHead>

                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Paid
                                    </TableHead>

                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Balance
                                    </TableHead>

                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Status
                                    </TableHead>

                                    <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {invoices.map((inv) => {
                                    const isPaid = inv.status === "Paid";

                                    return (
                                        <TableRow
                                            key={inv._id}
                                            className="border-border hover:bg-muted/40"
                                        >
                                            <TableCell className="py-4 font-mono text-xs font-semibold text-foreground">
                                                {inv.invoiceNumber}
                                            </TableCell>

                                            <TableCell className="py-4 text-xs">
                                                {formatDate(inv.createdAt)}
                                            </TableCell>

                                            <TableCell className="py-4 text-xs">
                                                ₹{inv.totalAmount?.toLocaleString()}
                                            </TableCell>

                                            <TableCell className="py-4 text-xs">
                                                ₹{inv.totalPaid?.toLocaleString()}
                                            </TableCell>

                                            <TableCell className="py-4 text-xs font-semibold text-foreground">
                                                ₹{inv.remainingAmount?.toLocaleString()}
                                            </TableCell>

                                            <TableCell className="py-4">
                                                <span
                                                    className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${isPaid
                                                            ? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
                                                            : "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                                        }`}
                                                >
                                                    {inv.status}
                                                </span>
                                            </TableCell>

                                            <TableCell className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {!isPaid && (
                                                        <Button
                                                            size="xs"
                                                            onClick={() =>
                                                                setPayingInvoice(inv)
                                                            }
                                                            className="h-8 rounded-lg bg-primary px-3 text-xs text-primary-foreground hover:opacity-90"
                                                        >
                                                            Pay Balance
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            window.open(
                                                                `http://localhost:5000/api/v1/invoices/${inv._id}/pdf`,
                                                                "_blank"
                                                            )
                                                        }
                                                        className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    >
                                                        <Download size={14} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Payment Dialog */}
            <Dialog
                open={!!payingInvoice}
                onOpenChange={(open) => !open && setPayingInvoice(null)}
            >
                <DialogContent className="max-w-sm rounded-xl border-border bg-card">
                    <DialogHeader>
                        <DialogTitle>
                            Clear Outstanding Balance
                        </DialogTitle>

                        <DialogDescription>
                            Submit a payment transaction to settle your reservation
                            balance.
                        </DialogDescription>
                    </DialogHeader>

                    {payingInvoice && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-4">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Due Balance
                                </span>

                                <span className="text-lg font-bold text-primary">
                                    ₹
                                    {payingInvoice.remainingAmount?.toLocaleString()}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground">
                                    Choose Payment Gateway
                                </label>

                                <Select
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
                                >
                                    <SelectTrigger className="border-input bg-background">
                                        <SelectValue placeholder="Payment Method" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Online">
                                            Online Payment
                                        </SelectItem>

                                        <SelectItem value="Card">
                                            Card Payment
                                        </SelectItem>

                                        <SelectItem value="Cash">
                                            Cash Settle
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPayingInvoice(null)}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handlePaySubmit}
                            disabled={payMutation.isPending}
                            className="bg-primary text-primary-foreground hover:opacity-90"
                        >
                            {payMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Settle Now"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
