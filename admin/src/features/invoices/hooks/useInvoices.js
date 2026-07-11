import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import toast from "react-hot-toast";

export const useInvoices = (invoiceId = null) => {
    const queryClient = useQueryClient();

    // Fetch all invoices
    const { data: allInvoicesData, isLoading: isLoadingAll, error: allInvoicesError } = useQuery({
        queryKey: ["invoices"],
        queryFn: async () => {
            const response = await api.get("/invoices");
            return response.data;
        },
    });

    const invoices = allInvoicesData?.data || [];

    // Fetch single invoice if invoiceId is provided
    const { data: invoiceDetailsData, isLoading: isLoadingDetails, error: detailsError } = useQuery({
        queryKey: ["invoice", invoiceId],
        queryFn: async () => {
            const response = await api.get(`/invoices/${invoiceId}`);
            return response.data;
        },
        enabled: !!invoiceId,
    });

    const invoiceDetails = invoiceDetailsData?.data || null;

    // Record invoice balance payment
    const payInvoiceMutation = useMutation({
        mutationFn: async ({ id, amountPaid }) => {
            const response = await api.patch(`/invoices/${id}/pay`, { amountPaid });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] });
            toast.success("Invoice payment recorded successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to record payment");
        },
    });

    return {
        invoices,
        invoiceDetails,
        isLoadingAll,
        isLoadingDetails,
        allInvoicesError,
        detailsError,
        payInvoice: payInvoiceMutation.mutateAsync,
        isPaying: payInvoiceMutation.isPending,
    };
};
