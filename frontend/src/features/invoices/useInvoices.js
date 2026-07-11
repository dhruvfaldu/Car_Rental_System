import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyInvoices, getInvoiceById, payInvoiceBalance } from "./invoiceApi";
import toast from "react-hot-toast";

export const useMyInvoicesQuery = () => {
    return useQuery({
        queryKey: ["invoices"],
        queryFn: getMyInvoices,
    });
};

export const useInvoiceDetailsQuery = (id) => {
    return useQuery({
        queryKey: ["invoice", id],
        queryFn: () => getInvoiceById(id),
        enabled: !!id,
    });
};

export const usePayInvoiceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: payInvoiceBalance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            toast.success("Invoice balance paid successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to pay invoice balance");
        },
    });
};
