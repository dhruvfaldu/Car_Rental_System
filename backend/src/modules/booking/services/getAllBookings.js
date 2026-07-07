import { Booking } from "../booking.model.js";
import ApiFeatures from "../../../utils/ApiFeatures.js";
import { getPagination } from "../../../utils/pagination.js";
import { getPaginationMeta } from "../../../utils/responseMeta.js";

export const getAllBookings = async ({
    queryParams,
}) => {
    const {
        page = 1,
        limit = 10,
        bookingStatus,
        paymentStatus,
        user,
        car,
        startDate,
        endDate,
    } = queryParams;

    const filter = {};

    if (bookingStatus) {
        filter.bookingStatus = bookingStatus;
    }

    if (user) {
        filter.user = user;
    }

    if (car) {
        filter.car = car;
    }

    if (startDate || endDate) {
        filter.pickupDate = {};

        if (startDate) {
            filter.pickupDate.$gte = new Date(startDate);
        }

        if (endDate) {
            filter.pickupDate.$lte = new Date(endDate);
        }
    }

    const { skip } = getPagination({
        page,
        limit,
    });

    const features = new ApiFeatures(
        Booking.find(filter)
            .populate("user", "name email")
            .populate("car", "name carId images"),
        queryParams
    )
        .search(["bookingNumber"])
        .sort()
        .paginate(skip, Number(limit));

    const [bookings, total] = await Promise.all([
        features.query.lean(),
        Booking.countDocuments(filter),
    ]);

    return {
        bookings,
        pagination: getPaginationMeta({
            page: Number(page),
            limit: Number(limit),
            total,
        }),
    };
};