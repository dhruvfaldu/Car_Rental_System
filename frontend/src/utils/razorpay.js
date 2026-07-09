import { createPayment, createOrder, verifyPayment } from "../features/payment/paymentApi";
import toast from "react-hot-toast";

export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        // Prevent loading multiple scripts
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

/**
 * Handles the complete Razorpay payment flow.
 */
export const processRazorpayPayment = async ({
    bookingId,
    amount, // Total booking amount
    user,
    onSuccess,
    onError,
    onPending,
}) => {
    const loadingToast = toast.loading("Initializing secure payment gateway...");
    try {
        // 1. Create a payment record in our backend
        if (onPending) onPending(true);
        const paymentRes = await createPayment({
            bookingId,
            paymentMethod: "Online",
            paymentGateway: "Razorpay",
        });

        const payment = paymentRes.data;

        // 2. Create a Razorpay Order
        const orderRes = await createOrder(payment._id);
        const order = orderRes.data;

        // 3. Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            toast.dismiss(loadingToast);
            toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
            if (onPending) onPending(false);
            return;
        }

        toast.dismiss(loadingToast);

        // 4. Configure Razorpay checkout options
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T8ewTxde4PGn5u",
            amount: order.amount, // already in paise
            currency: order.currency || "INR",
            name: "CarRental Premium",
            description: `Payment for Booking No. ${payment.booking?.bookingNumber || bookingId}`,
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200",
            order_id: order.orderId,
            handler: async function (response) {
                const verifyingToast = toast.loading("Verifying your payment...");
                try {
                    // 5. Send transaction details to backend for verification
                    const verifyRes = await verifyPayment({
                        paymentId: payment._id,
                        orderId: order.orderId,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                        gatewayResponse: response,
                    });

                    toast.dismiss(verifyingToast);
                    toast.success("Payment successful and verified!");
                    if (onSuccess) onSuccess(verifyRes.data);
                } catch (error) {
                    toast.dismiss(verifyingToast);
                    console.error("Verification error:", error);
                    toast.error(
                        error.response?.data?.message ||
                        "Payment verification failed. Please contact support."
                    );
                    if (onError) onError(error);
                } finally {
                    if (onPending) onPending(false);
                }
            },
            prefill: {
                name: user?.name || "",
                email: user?.email || "",
                contact: user?.phone || "",
            },
            theme: {
                color: "#4f46e5", // Indigo theme
            },
            modal: {
                ondismiss: function () {
                    toast.error("Payment checkout cancelled.");
                    if (onPending) onPending(false);
                },
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Payment initialization error:", error);
        toast.error(
            error.response?.data?.message ||
            "Failed to initialize payment order."
        );
        if (onError) onError(error);
        if (onPending) onPending(false);
    }
};
