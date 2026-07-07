import nodemailer from "nodemailer";

class NotificationService {
    constructor() {
        this.transporter = null;

        // Configure transporter if env variables exist
        if (
            process.env.SMTP_HOST &&
            process.env.SMTP_PORT &&
            process.env.SMTP_USER &&
            process.env.SMTP_PASS
        ) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            console.log("📧 SMTP Email Transporter Configured.");
        } else {
            console.log("ℹ️ No SMTP configuration found. Notifications will be logged to console/files.");
        }
    }

    /**
     * Universal dispatcher
     */
    async dispatch({ userId, userEmail, userName, userPhone, type, title, message, htmlContent }) {
        console.log(`\n🔔 [NOTIFICATION] [${type}] to User: ${userName} (${userEmail || "No Email"}, ${userPhone || "No Phone"})`);
        console.log(`📌 Title: ${title}`);
        console.log(`💬 Message: ${message}`);

        // 1. Email Delivery
        if (userEmail) {
            await this.sendEmail(userEmail, title, htmlContent || message);
        }

        // 2. SMS Delivery (Mock)
        if (userPhone) {
            await this.sendSMS(userPhone, message);
        }

        // 3. Push Notification (Mock)
        if (userId) {
            await this.sendPush(userId, title, message);
        }
    }

    async sendEmail(to, subject, body) {
        if (this.transporter) {
            try {
                await this.transporter.sendMail({
                    from: `"Car Rental System" <${process.env.SMTP_USER}>`,
                    to,
                    subject,
                    html: body,
                });
                console.log(`✅ Email sent successfully to ${to}`);
            } catch (error) {
                console.error(`❌ Failed to send email to ${to}:`, error.message);
            }
        } else {
            console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
        }
    }

    async sendSMS(phone, message) {
        console.log(`[MOCK SMS] To: ${phone} | Msg: ${message}`);
    }

    async sendPush(userId, title, message) {
        console.log(`[MOCK PUSH] User: ${userId} | Title: ${title} | Msg: ${message}`);
    }

    // --- Specific Notifications ---

    async sendBookingConfirmation(user, booking) {
        const title = "🚗 Booking Confirmed!";
        const message = `Dear ${user.name}, your booking ${booking.bookingNumber} is confirmed. Pickup location: ${booking.pickupLocation} on ${new Date(booking.pickupDate).toLocaleDateString()}.`;
        const htmlContent = `
            <h2>Booking Confirmation</h2>
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>Your booking <strong>${booking.bookingNumber}</strong> has been successfully confirmed!</p>
            <ul>
                <li><strong>Car:</strong> ${booking.car?.name || "Selected Vehicle"}</li>
                <li><strong>Pickup Date:</strong> ${new Date(booking.pickupDate).toLocaleString()}</li>
                <li><strong>Pickup Location:</strong> ${booking.pickupLocation}</li>
                <li><strong>Return Date:</strong> ${new Date(booking.returnDate).toLocaleString()}</li>
                <li><strong>Amount:</strong> ₹${booking.totalAmount}</li>
            </ul>
            <p>Thank you for choosing Car Rental System!</p>
        `;
        await this.dispatch({
            userId: user._id,
            userEmail: user.email,
            userName: user.name,
            userPhone: user.phone,
            type: "BOOKING_CONFIRMED",
            title,
            message,
            htmlContent,
        });
    }

    async sendBookingCancelled(user, booking) {
        const title = "⚠️ Booking Cancelled";
        const message = `Dear ${user.name}, your booking ${booking.bookingNumber} has been cancelled. Reason: ${booking.cancelReason || "Not specified"}.`;
        const htmlContent = `
            <h2>Booking Cancellation</h2>
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>Your booking <strong>${booking.bookingNumber}</strong> has been cancelled.</p>
            <p><strong>Reason:</strong> ${booking.cancelReason || "Not specified"}</p>
            <p>If you did not request this, please contact our support team immediately.</p>
        `;
        await this.dispatch({
            userId: user._id,
            userEmail: user.email,
            userName: user.name,
            userPhone: user.phone,
            type: "BOOKING_CANCELLED",
            title,
            message,
            htmlContent,
        });
    }

    async sendPaymentSuccess(user, payment) {
        const title = "💳 Payment Successful!";
        const message = `Dear ${user.name}, we received your payment of ₹${payment.amount} for booking receipt: ${payment.receipt || "N/A"}.`;
        const htmlContent = `
            <h2>Payment Receipt</h2>
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>Thank you for your payment. Here are the transaction details:</p>
            <ul>
                <li><strong>Transaction ID:</strong> ${payment.transactionId || "N/A"}</li>
                <li><strong>Amount Paid:</strong> ₹${payment.amount}</li>
                <li><strong>Payment Method:</strong> ${payment.paymentMethod}</li>
                <li><strong>Date:</strong> ${payment.paidAt ? new Date(payment.paidAt).toLocaleString() : new Date().toLocaleString()}</li>
            </ul>
        `;
        await this.dispatch({
            userId: user._id,
            userEmail: user.email,
            userName: user.name,
            userPhone: user.phone,
            type: "PAYMENT_SUCCESS",
            title,
            message,
            htmlContent,
        });
    }

    async sendPickupReminder(user, booking) {
        const title = "📅 Upcoming Pickup Reminder";
        const message = `Dear ${user.name}, this is a reminder for your upcoming car pickup ${booking.bookingNumber} scheduled on ${new Date(booking.pickupDate).toLocaleString()}.`;
        await this.dispatch({
            userId: user._id,
            userEmail: user.email,
            userName: user.name,
            userPhone: user.phone,
            type: "PICKUP_REMINDER",
            title,
            message,
        });
    }

    async sendReturnReminder(user, booking) {
        const title = "📅 Return Reminder";
        const message = `Dear ${user.name}, your car return for booking ${booking.bookingNumber} is scheduled by ${new Date(booking.returnDate).toLocaleString()}. Please return the vehicle to ${booking.dropLocation}.`;
        await this.dispatch({
            userId: user._id,
            userEmail: user.email,
            userName: user.name,
            userPhone: user.phone,
            type: "RETURN_REMINDER",
            title,
            message,
        });
    }

    async sendInvoiceGenerated(user, invoice) {
        const title = "📄 Invoice Generated";
        const message = `Dear ${user.name}, your invoice ${invoice.invoiceNumber} has been generated. Total Amount: ₹${invoice.totalAmount}. Status: ${invoice.status}.`;
        const htmlContent = `
            <h2>Invoice Details</h2>
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>Your invoice <strong>${invoice.invoiceNumber}</strong> is ready for review.</p>
            <ul>
                <li><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</li>
                <li><strong>Base Rent Subtotal:</strong> ₹${invoice.subtotal}</li>
                <li><strong>Late Return Fees:</strong> ₹${invoice.extraCharges?.lateFee || 0}</li>
                <li><strong>Extra Kilometers Fee:</strong> ₹${invoice.extraCharges?.extraKMFee || 0}</li>
                <li><strong>Damage/Fuel/Cleaning Charges:</strong> ₹${(invoice.extraCharges?.fuelCharges || 0) + (invoice.extraCharges?.cleaningCharges || 0) + (invoice.extraCharges?.damageCharges || 0)}</li>
                <li><strong>GST (Tax):</strong> ₹${invoice.tax}</li>
                <li><strong>Grand Total:</strong> ₹${invoice.totalAmount}</li>
                <li><strong>Total Paid:</strong> ₹${invoice.totalPaid}</li>
                <li><strong>Remaining Balance:</strong> ₹${invoice.remainingAmount}</li>
                <li><strong>Invoice Status:</strong> ${invoice.status}</li>
            </ul>
            <p>Thank you for driving with us!</p>
        `;
        await this.dispatch({
            userId: user._id,
            userEmail: user.email,
            userName: user.name,
            userPhone: user.phone,
            type: "INVOICE_GENERATED",
            title,
            message,
            htmlContent,
        });
    }
}

export default new NotificationService();
