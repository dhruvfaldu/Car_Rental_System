import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import Car from "../modules/Cars/car.model.js";
import { Booking } from "../modules/booking/booking.model.js";
import User from "../models/user.model.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Core Counts
    const totalCars = await Car.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });

    // 2. Revenue Calculation
    const revenueStats = await Booking.aggregate([
        {
            $match: {
                bookingStatus: { $ne: "Cancelled" },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);
    const totalRevenue = revenueStats[0]?.totalRevenue || 0;

    // 3. Fleet Status Distribution
    const fleetStatusRaw = await Car.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    
    // Normalize fleet status distribution
    const fleetDistribution = {
        Available: 0,
        Booked: 0,
        Rented: 0,
        Maintenance: 0,
    };
    fleetStatusRaw.forEach(item => {
        if (item._id in fleetDistribution) {
            fleetDistribution[item._id] = item.count;
        }
    });

    // 4. Booking Status Distribution
    const bookingStatusRaw = await Booking.aggregate([
        {
            $group: {
                _id: "$bookingStatus",
                count: { $sum: 1 },
            },
        },
    ]);

    const bookingDistribution = {
        Pending: 0,
        Confirmed: 0,
        "Picked Up": 0,
        Completed: 0,
        Cancelled: 0,
    };
    bookingStatusRaw.forEach(item => {
        if (item._id in bookingDistribution) {
            bookingDistribution[item._id] = item.count;
        } else if (item._id === "PickedUp") {
            bookingDistribution["Picked Up"] = item.count;
        }
    });

    // 5. Recent Bookings
    const recentBookings = await Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email phone")
        .populate("car", "name");

    res.status(200).json(
        new ApiResponse(200, "Dashboard stats fetched successfully", {
            counts: {
                totalCars,
                totalBookings,
                totalRevenue,
                totalCustomers,
            },
            fleetStatus: Object.keys(fleetDistribution).map((key, index) => ({
                id: index + 1,
                label: key,
                value: fleetDistribution[key],
            })),
            bookingStatus: Object.keys(bookingDistribution).map((key, index) => ({
                id: index + 1,
                label: key,
                value: bookingDistribution[key],
            })),
            recentBookings: recentBookings.map(b => ({
                id: b.bookingNumber || b._id,
                customer: b.user?.name || "Unknown Customer",
                car: b.car?.name || "Unknown Car",
                pickup: new Date(b.pickupDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }),
                returnDate: new Date(b.returnDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }),
                status: b.bookingStatus,
            })),
        })
    );
});
