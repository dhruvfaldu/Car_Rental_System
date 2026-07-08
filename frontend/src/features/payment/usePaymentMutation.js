import { useMutation } from "@tanstack/react-query";
import { createPayment, createOrder, verifyPayment } from "./paymentApi";

export function useCreatePayment() {
    return useMutation({
        mutationFn: createPayment,
    });
}

export function useCreateOrder() {
    return useMutation({
        mutationFn: createOrder,
    });
}

export function useVerifyPayment() {
    return useMutation({
        mutationFn: verifyPayment,
    });
}
