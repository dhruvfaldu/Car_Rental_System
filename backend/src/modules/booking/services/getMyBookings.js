import { Booking } from "../booking.model.js";

export const getMyBookings = async ({
    userId,
    page = 1,
    limit = 10,
    bookingStatus,
    paymentStatus,
    search,
    startDate,
    endDate,
}) => {
    const filter = {
        user: userId,
    };

    // Booking Status Filter
    if (bookingStatus) {
        filter.bookingStatus = bookingStatus;
    }

    // Payment Status Filter
    if (paymentStatus) {
        filter.paymentStatus = paymentStatus;
    }

    // Booking Number Search
    if (search) {
        filter.bookingNumber = {
            $regex: search,
            $options: "i",
        };
    }

    // Date Range Filter
    if (startDate || endDate) {
        filter.pickupDate = {};

        if (startDate) {
            filter.pickupDate.$gte = new Date(startDate);
        }

        if (endDate) {
            filter.pickupDate.$lte = new Date(endDate);
        }
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate({
                path: "car",
                select:
                    "name slug pricePerDay images status",
                populate: {
                    path: "brand",
                    select: "name",
                },
            })
            .populate({
                path: "payment",
                select:
                    "status paymentMethod paidAt",
            })
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        Booking.countDocuments(filter),
    ]);

    return {
        bookings,

        pagination: {
            page: Number(page),
            limit: Number(limit),

            totalRecords: total,

            totalPages: Math.ceil(total / limit),

            hasNextPage:
                page * limit < total,

            hasPreviousPage:
                page > 1,
        },
    };
};