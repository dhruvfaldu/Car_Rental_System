import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
    const appType = req.headers["x-app-type"] || "customer";
    const cookieName = appType === "admin" ? "adminAccessToken" : "accessToken";
    const token = req.cookies[cookieName];

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    if (appType === "customer" && (user.role === "admin" || user.role === "staff")) {
        throw new ApiError(403, "Access denied. Please log in through the Admin Panel.");
    }

    req.user = user;

    next();
});

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(403, "Access denied")
            );
        }

        next();
    };
};