import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import Invoice from "./invoice.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getInvoiceById = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
        .populate("customer", "name email phone")
        .populate({
            path: "booking",
            select: "bookingNumber totalDays pricePerDay subtotal tax discount totalAmount pickupDate returnDate",
            populate: {
                path: "car",
                select: "name carId pricePerDay"
            }
        })
        .populate("pickup", "pickupDate odometerStart fuelLevel")
        .populate("return", "returnDate odometerEnd fuelLevel lateHours extraKM");

    if (!invoice) {
        throw new ApiError(404, "Invoice not found.");
    }

    // Customer security check
    if (req.user.role === "customer" && invoice.customer._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied. You can only view your own invoices.");
    }

    return res.status(200).json(
        new ApiResponse(200, "Invoice fetched successfully.", invoice)
    );
});

export const getMyInvoices = asyncHandler(async (req, res) => {
    const invoices = await Invoice.find({ customer: req.user._id })
        .populate({
            path: "booking",
            select: "bookingNumber",
            populate: {
                path: "car",
                select: "name carId"
            }
        })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, "My invoices fetched successfully.", invoices)
    );
});

export const getAllInvoices = asyncHandler(async (req, res) => {
    const invoices = await Invoice.find()
        .populate("customer", "name email phone")
        .populate({
            path: "booking",
            select: "bookingNumber",
            populate: {
                path: "car",
                select: "name carId"
            }
        })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, "All invoices fetched successfully.", invoices)
    );
});

export const payInvoiceBalance = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { amountPaid } = req.body;
        const invoice = await Invoice.findById(req.params.id).session(session);

        if (!invoice) {
            throw new ApiError(404, "Invoice not found.");
        }

        if (invoice.status === "Paid") {
            throw new ApiError(400, "Invoice has already been fully paid.");
        }

        invoice.totalPaid += Number(amountPaid);
        invoice.remainingAmount = Math.max(0, invoice.totalAmount - invoice.totalPaid);

        if (invoice.remainingAmount === 0) {
            invoice.status = "Paid";
        }

        await invoice.save({ session });
        await session.commitTransaction();

        return res.status(200).json(
            new ApiResponse(200, "Invoice payment recorded successfully.", invoice)
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export const downloadInvoicePdf = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
        .populate("customer", "name email phone")
        .populate({
            path: "booking",
            select: "bookingNumber totalDays pricePerDay subtotal tax discount totalAmount pickupDate returnDate",
            populate: {
                path: "car",
                select: "name carId"
            }
        })
        .populate("pickup", "pickupDate odometerStart fuelLevel")
        .populate("return", "returnDate odometerEnd fuelLevel lateHours extraKM");

    if (!invoice) {
        throw new ApiError(404, "Invoice not found.");
    }

    if (req.user.role === "customer" && invoice.customer._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied.");
    }

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Invoice-${invoice.invoiceNumber}.pdf`);

    doc.pipe(res);

    // Document Header
    doc.fillColor("#1A202C").fontSize(20).text("CAR RENTAL SYSTEM INVOICE", { align: "center" });
    doc.moveDown();

    doc.fontSize(10).fillColor("#4A5568");
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
    doc.text(`Status: ${invoice.status.toUpperCase()}`);
    doc.moveDown();

    // Line separator
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#CBD5E0").stroke();
    doc.moveDown();

    // Customer & Booking Details
    doc.fontSize(12).fillColor("#2D3748").text("Customer & Booking Information", { underline: true });
    doc.fontSize(10).fillColor("#4A5568");
    doc.text(`Name: ${invoice.customer.name}`);
    doc.text(`Email: ${invoice.customer.email}`);
    doc.text(`Phone: ${invoice.customer.phone || "N/A"}`);
    doc.text(`Booking Ref: ${invoice.booking.bookingNumber}`);
    doc.text(`Vehicle: ${invoice.booking.car?.name || "Rental Vehicle"}`);
    doc.text(`Duration: ${invoice.booking.totalDays} Days`);
    doc.moveDown();

    // Odometer & Fuel Details
    doc.fontSize(12).fillColor("#2D3748").text("Rental Log Checklists", { underline: true });
    doc.fontSize(10).fillColor("#4A5568");
    if (invoice.pickup) {
        doc.text(`Pickup Odometer: ${invoice.pickup.odometerStart} KM | Fuel: ${invoice.pickup.fuelLevel}%`);
    }
    if (invoice.return) {
        doc.text(`Return Odometer: ${invoice.return.odometerEnd} KM | Fuel: ${invoice.return.fuelLevel}%`);
        doc.text(`Late Return: ${invoice.return.lateHours} Hours | Extra Distance: ${invoice.return.extraKM} KM`);
    }
    doc.moveDown();

    // Pricing Table
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#CBD5E0").stroke();
    doc.moveDown();

    doc.fontSize(12).fillColor("#2D3748").text("Financial Summary", { underline: true });
    doc.fontSize(10).fillColor("#4A5568");

    doc.text(`Base Rent Subtotal: ₹${invoice.subtotal.toFixed(2)}`);
    doc.text(`Late Return Fee: ₹${(invoice.extraCharges?.lateFee || 0).toFixed(2)}`);
    doc.text(`Extra Distance Fee: ₹${(invoice.extraCharges?.extraKMFee || 0).toFixed(2)}`);
    doc.text(`Fuel Refilling Charges: ₹${(invoice.extraCharges?.fuelCharges || 0).toFixed(2)}`);
    doc.text(`Cleaning Charges: ₹${(invoice.extraCharges?.cleaningCharges || 0).toFixed(2)}`);
    doc.text(`Damage Charges: ₹${(invoice.extraCharges?.damageCharges || 0).toFixed(2)}`);
    doc.text(`GST / Taxes: ₹${invoice.tax.toFixed(2)}`);
    doc.text(`Discount Applied: -₹${invoice.discount.toFixed(2)}`);
    
    doc.moveDown();
    doc.fontSize(12).fillColor("#1A202C");
    doc.text(`Grand Total: ₹${invoice.totalAmount.toFixed(2)}`, { bold: true });
    doc.text(`Total Paid: ₹${invoice.totalPaid.toFixed(2)}`);
    doc.text(`Remaining Balance: ₹${invoice.remainingAmount.toFixed(2)}`);

    doc.moveDown(2);
    doc.fontSize(10).fillColor("#718096").text("Thank you for riding with us. Drive safe!", { align: "center" });

    doc.end();
});
