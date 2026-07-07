import Payment from "../payment.model.js";

import ApiFeatures from "../../../utils/ApiFeatures.js";

import { getPagination } from "../../../utils/pagination.js";

import { getPaginationMeta } from "../../../utils/responseMeta.js";

export const getAllPayments = async ({
    queryParams,
}) => {
    const {
        page = 1,
        limit = 10,
        status,
        paymentMethod,
        paymentGateway,
        user,
        booking,
        startDate,
        endDate,
    } = queryParams;

    const filter = {};

    // Payment Status
    if (status) {
        filter.status = status;
    }

    // Payment Method
    if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
    }

    // Payment Gateway
    if (paymentGateway) {
        filter.paymentGateway = paymentGateway;
    }

    // User Filter
    if (user) {
        filter.user = user;
    }

    // Booking Filter
    if (booking) {
        filter.booking = booking;
    }

    // Date Range
    if (startDate || endDate) {
        filter.createdAt = {};

        if (startDate) {
            filter.createdAt.$gte = new Date(startDate);
        }

        if (endDate) {
            filter.createdAt.$lte = new Date(endDate);
        }
    }

    const { skip } = getPagination({
        page,
        limit,
    });

    const features = new ApiFeatures(
        Payment.find(filter)
            .populate({
                path: "user",
                select: "name email",
            })
            .populate({
                path: "booking",
                select:
                    "bookingNumber totalAmount bookingStatus paymentStatus",
            }),
        queryParams
    )
        .search([
            "transactionId",
            "orderId",
        ])
        .sort()
        .paginate(skip, Number(limit));

    const [payments, total] = await Promise.all([
        features.query.lean(),
        Payment.countDocuments(filter),
    ]);

    return {
        payments,

        pagination: getPaginationMeta({
            page: Number(page),
            limit: Number(limit),
            total,
        }),
    };
};  