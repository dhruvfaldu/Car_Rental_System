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
                paymentMethod,
            });
            setPayingInvoice(null);
            refetch();
        } catch (err) {}
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
        <div className="space-y-6 text-zinc-100 animate-fade-in">
            <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">My Invoices</h3>
                <p className="text-sm text-zinc-400">Access your billing history, check balances, and download transaction PDFs.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 size={36} className="animate-spin text-sky-500" />
                    <p className="text-sm text-zinc-400 font-medium">Retrieving invoices...</p>
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center max-w-sm mx-auto">
                    <AlertCircle size={36} className="text-rose-500" />
                    <h4 className="text-base font-bold text-zinc-200">Failed to load invoices</h4>
                    <p className="text-xs text-zinc-500">We couldn't retrieve your invoice records. Please check backend connection.</p>
                    <Button onClick={() => refetch()} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
                        Try Again
                    </Button>
                </div>
            ) : invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10 p-6 max-w-md mx-auto">
                    <FileText className="h-8 w-8 text-zinc-600" />
                    <p className="text-xs text-zinc-400">No invoices generated yet. Invoices are created automatically when rentals complete.</p>
                </div>
            ) : (
                <Card className="border-zinc-805 border-zinc-800 bg-zinc-900/20 backdrop-blur-md">
                    <CardContent className="p-0">
                        <Table className="text-zinc-300">
                            <TableHeader className="border-zinc-800">
                                <TableRow className="border-zinc-850 hover:bg-transparent">
                                    <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs">Invoice #</TableHead>
                                    <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs">Date</TableHead>
                                    <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs">Total</TableHead>
                                    <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs">Paid</TableHead>
                                    <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs">Balance</TableHead>
                                    <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs">Status</TableHead>
                                    <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-xs text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((inv) => {
                                    const isPaid = inv.status === "Paid";
                                    return (
                                        <TableRow key={inv._id} className="border-zinc-800/60 hover:bg-zinc-900/10 transition-colors">
                                            <TableCell className="font-semibold text-zinc-305 font-mono text-xs py-4">{inv.invoiceNumber}</TableCell>
                                            <TableCell className="text-xs py-4">{formatDate(inv.createdAt)}</TableCell>
                                            <TableCell className="text-xs py-4">₹{inv.totalAmount?.toLocaleString()}</TableCell>
                                            <TableCell className="text-xs py-4">₹{inv.totalPaid?.toLocaleString()}</TableCell>
                                            <TableCell className="text-xs font-semibold py-4 text-zinc-150">
                                                ₹{inv.remainingAmount?.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                                                    isPaid
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                }`}>
                                                    {inv.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {!isPaid && (
                                                        <Button
                                                            size="xs"
                                                            onClick={() => setPayingInvoice(inv)}
                                                            className="bg-gradient-to-r from-sky-650 to-indigo-650 bg-sky-600 hover:bg-sky-500 text-white font-bold h-8 text-[11px] px-2.5 rounded-lg shadow"
                                                        >
                                                            Pay Balance
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            // Open PDF route in a new tab
                                                            window.open(`http://localhost:5000/api/v1/invoices/${inv._id}/pdf`, "_blank");
                                                        }}
                                                        className="h-8 w-8 text-zinc-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg"
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

            {/* Pay Invoice Dialog */}
            <Dialog open={!!payingInvoice} onOpenChange={(open) => !open && setPayingInvoice(null)}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-sm rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-100 font-bold text-lg">Clear Outstanding Balance</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-sm">
                            Submit a payment transaction to settle your reservation balance.
                        </DialogDescription>
                    </DialogHeader>

                    {payingInvoice && (
                        <div className="space-y-4 py-4">
                            <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-850 flex justify-between items-center">
                                <span className="text-xs text-zinc-400 font-medium">Due Balance</span>
                                <span className="text-lg font-bold text-sky-400">₹{payingInvoice.remainingAmount?.toLocaleString()}</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-300">Choose Payment Gateway</label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger className="bg-zinc-950 border-zinc-850 border-zinc-800 text-zinc-200">
                                        <SelectValue placeholder="Payment Method" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                                        <SelectItem value="Online">Online Payment</SelectItem>
                                        <SelectItem value="Card">Card Payment</SelectItem>
                                        <SelectItem value="Cash">Cash Settle</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPayingInvoice(null)}
                            className="bg-transparent border-zinc-805 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePaySubmit}
                            disabled={payMutation.isPending}
                            className="bg-gradient-to-r from-sky-650 to-indigo-650 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-lg"
                        >
                            {payMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Settle Now"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
