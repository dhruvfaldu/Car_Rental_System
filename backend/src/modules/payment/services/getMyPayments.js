import Payment from "../payment.model.js";

export const getMyPayments = async ({
    userId,
    page = 1,
    limit = 10,
    status,
    paymentMethod,
    paymentGateway,
    search,
}) => {
    const filter = {
        user: userId,
    };

    // Payment Status Filter
    if (status) {
        filter.status = status;
    }

    // Payment Method Filter
    if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
    }

    // Payment Gateway Filter
    if (paymentGateway) {
        filter.paymentGateway = paymentGateway;
    }

    // Transaction ID Search
    if (search) {
        filter.transactionId = {
            $regex: search,
            $options: "i",
        };
    }

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
        Payment.find(filter)
            .populate({
                path: "booking",
                select:
                    "bookingNumber totalAmount bookingStatus pickupDate returnDate",
                populate: {
                    path: "car",
                    select: "name carId images",
                },
            })
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(Number(limit))
            .lean(),

        Payment.countDocuments(filter),
    ]);

    return {
        payments,

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