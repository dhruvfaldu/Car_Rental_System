import User from "../models/user.model.js";
import QueryBuilder from "../utils/queryBuilder.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getAllUsers = asyncHandler(async (req, res) => {
    const totalRecordsQuery = User.find({});
    const totalRecordsQB = new QueryBuilder(totalRecordsQuery, req.query).search(["name", "email", "phone"]);
    if (req.query.role && req.query.role !== "all") {
        totalRecordsQB.query = totalRecordsQB.query.find({ role: req.query.role });
    }
    const totalRecords = await totalRecordsQB.query.countDocuments();

    const query = User.find({});
    const qb = new QueryBuilder(query, req.query)
        .search(["name", "email", "phone"])
        .sort()
        .paginate();

    if (req.query.role && req.query.role !== "all") {
        qb.query = qb.query.find({ role: req.query.role });
    }

    const users = await qb.query;

    return res.status(200).json(
        new ApiResponse(
            200,
            "Users fetched successfully",
            {
                users,
                pagination: {
                    totalRecords,
                    page: qb.page,
                    limit: qb.limit,
                    totalPages: Math.ceil(totalRecords / qb.limit) || 1,
                }
            }
        )
    );
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["customer", "admin", "staff", "driver"].includes(role)) {
        throw new ApiError(400, "Invalid role specified");
    }

    const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "User role updated successfully", user)
    );
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (id.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot delete your own administrative account");
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "User deleted successfully", user)
    );
});
