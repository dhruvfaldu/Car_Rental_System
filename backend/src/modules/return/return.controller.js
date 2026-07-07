import mongoose from "mongoose";
import Return from "./return.model.js";
import Pickup from "../pickup/pickup.model.js";
import { Booking } from "../booking/booking.model.js";
import Car from "../Cars/car.model.js";
import Invoice from "../invoice/invoice.model.js";
import Payment from "../payment/payment.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { uploadMultipleImages } from "../../services/cloudinary.service.js";
import { CAR_STATUS } from "../Cars/car.constant.js";
import { BOOKING_STATUS } from "../booking/booking.constant.js";
import { calculateExtraCharges } from "../../utils/extraCharges.util.js";
import notificationService from "../../services/notification.service.js";
import User from "../../models/user.model.js";
import { generateBookingNumber } from "../booking/booking.utils.js"; // fallback helper or random number generator

export const createReturn = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const {
            booking: bookingId,
            odometerEnd,
            fuelLevel: fuelEnd,
            damageNotes,
            cleaningCharges = 0,
            damageCharges = 0,
        } = req.body;

        // 1. Fetch booking
        const booking = await Booking.findById(bookingId).session(session);
        if (!booking) {
            throw new ApiError(404, "Booking not found.");
        }

        // 2. Validate booking status (must be Picked Up)
        const pickedUpStatus = BOOKING_STATUS.PICKED_UP || "Picked Up";
        if (booking.bookingStatus !== pickedUpStatus) {
            throw new ApiError(400, `Cannot process return for booking with status "${booking.bookingStatus}". Only Picked Up cars can be returned.`);
        }

        // 3. Find Pickup record
        const pickup = await Pickup.findOne({ booking: bookingId }).session(session);
        if (!pickup) {
            throw new ApiError(404, "No pickup details found for this booking. Pickup must be recorded first.");
        }

        // 4. Validate odometer reading
        if (odometerEnd < pickup.odometerStart) {
            throw new ApiError(
                400,
                `Odometer reading at return (${odometerEnd}) cannot be less than reading at pickup (${pickup.odometerStart}).`
            );
        }

        // 5. Fetch Car for rates
        const car = await Car.findById(booking.car).session(session);
        if (!car) {
            throw new ApiError(404, "Car not found.");
        }

        // 6. Upload damage images
        let uploadedDamageImages = [];
        if (req.files && req.files.length > 0) {
            uploadedDamageImages = await uploadMultipleImages(req.files, "car-rental/returns");
        }

        // 7. Calculate Extra Charges
        const actualReturnDate = new Date();
        const chargesBreakdown = calculateExtraCharges({
            booking,
            car,
            actualReturnDate,
            odometerEnd,
            odometerStart: pickup.odometerStart,
            fuelEnd,
            fuelStart: pickup.fuelLevel,
            cleaningCharges,
            damageCharges,
        });

        // 8. Create Return record
        const [returnRecord] = await Return.create(
            [
                {
                    booking: bookingId,
                    car: booking.car,
                    customer: booking.user,
                    returnDate: actualReturnDate,
                    returnLocation: booking.dropLocation,
                    odometerEnd,
                    fuelLevel: fuelEnd,
                    damageImages: uploadedDamageImages,
                    damageNotes: damageNotes || "",
                    lateHours: chargesBreakdown.lateHours,
                    extraKM: chargesBreakdown.extraKM,
                    staff: req.user._id,
                }
            ],
            { session }
        );

        // 9. Generate Invoice Number (e.g. INV-YYYYMMDD-XXXXXX)
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randHex = Math.floor(100000 + Math.random() * 900000);
        const invoiceNumber = `INV-${dateStr}-${randHex}`;

        // 10. Fetch booking payment status to see what has been paid
        let totalPaid = 0;
        let paymentDoc = null;
        if (booking.payment) {
            paymentDoc = await Payment.findById(booking.payment).session(session);
            if (paymentDoc && paymentDoc.status === "Paid") {
                totalPaid = paymentDoc.amount;
            }
        }

        const grandTotal = booking.totalAmount + chargesBreakdown.totalExtraAmount;
        const remainingAmount = Math.max(0, grandTotal - totalPaid);
        const invoiceStatus = remainingAmount === 0 ? "Paid" : "Pending";

        // Create Invoice
        const [invoice] = await Invoice.create(
            [
                {
                    invoiceNumber,
                    customer: booking.user,
                    booking: bookingId,
                    payment: booking.payment,
                    pickup: pickup._id,
                    return: returnRecord._id,
                    subtotal: booking.subtotal,
                    extraCharges: {
                        lateFee: chargesBreakdown.lateFee,
                        extraKMFee: chargesBreakdown.extraKMFee,
                        fuelCharges: chargesBreakdown.fuelCharges,
                        cleaningCharges: Number(cleaningCharges),
                        damageCharges: Number(damageCharges),
                    },
                    tax: booking.tax + chargesBreakdown.tax,
                    discount: booking.discount,
                    totalPaid,
                    totalAmount: grandTotal,
                    remainingAmount,
                    status: invoiceStatus,
                }
            ],
            { session }
        );

        // 11. Update Booking
        booking.bookingStatus = BOOKING_STATUS.COMPLETED || "Completed";
        booking.completedAt = actualReturnDate;
        booking.returnDetails = returnRecord._id;
        booking.invoice = invoice._id;
        await booking.save({ session });

        // 12. Update Car availability
        // If damages charges exist or specific damage notes are recorded, mark for maintenance, otherwise available
        const newCarStatus = (Number(damageCharges) > 2000 || damageNotes) 
            ? CAR_STATUS.MAINTENANCE 
            : CAR_STATUS.AVAILABLE;

        await Car.findByIdAndUpdate(
            booking.car,
            { status: newCarStatus },
            { session, new: true }
        );

        await session.commitTransaction();

        // 13. Send notifications
        const customerUser = await User.findById(booking.user);
        if (customerUser) {
            await notificationService.sendReturnReminder(customerUser, booking);
            await notificationService.sendInvoiceGenerated(customerUser, invoice);
        }

        const populatedReturn = await Return.findById(returnRecord._id)
            .populate("customer", "name email phone")
            .populate("car", "name carId")
            .populate("staff", "name email");

        return res.status(201).json(
            new ApiResponse(201, "Return processed & Invoice generated successfully.", {
                return: populatedReturn,
                invoice,
                extraChargesDetails: chargesBreakdown,
            })
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export const getReturnById = asyncHandler(async (req, res) => {
    const returnRecord = await Return.findById(req.params.id)
        .populate("customer", "name email phone")
        .populate("car", "name carId")
        .populate("staff", "name email")
        .populate("booking", "bookingNumber pickupDate returnDate");

    if (!returnRecord) {
        throw new ApiError(404, "Return record not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, "Return fetched successfully.", returnRecord)
    );
});

export const getReturnByBookingId = asyncHandler(async (req, res) => {
    const returnRecord = await Return.findOne({ booking: req.params.bookingId })
        .populate("customer", "name email phone")
        .populate("car", "name carId")
        .populate("staff", "name email");

    if (!returnRecord) {
        throw new ApiError(404, "Return record not found for this booking.");
    }

    return res.status(200).json(
        new ApiResponse(200, "Return fetched successfully.", returnRecord)
    );
});
