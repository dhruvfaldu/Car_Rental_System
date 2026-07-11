import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import cookieOptions from "../utils/cookieOptions.js";
import ApiError from "../utils/ApiError.js";

import {
    registerUser,
    loginUser,
    updateProfile,
} from "../services/auth.service.js";

// ... [existing controller definitions] ...
export const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            user
        )
    );
});

export const login = asyncHandler(async (req, res) => {
    const { user, token } = await loginUser(req.body);

    const appType = req.headers["x-app-type"] || "customer";
    const cookieName = appType === "admin" ? "adminAccessToken" : "accessToken";

    if (appType === "admin" && user.role !== "admin" && user.role !== "staff") {
        throw new ApiError(403, "Access denied. Only administrators or staff can log in here.");
    }

    if (appType === "customer" && (user.role === "admin" || user.role === "staff")) {
        throw new ApiError(403, "Access denied. Please log in through the Admin Panel.");
    }

    res.cookie(cookieName, token, cookieOptions);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            user
        )
    );
});

export const logout = asyncHandler(async (req, res) => {
    const appType = req.headers["x-app-type"] || "customer";
    const cookieName = appType === "admin" ? "adminAccessToken" : "accessToken";

    res.clearCookie(cookieName, cookieOptions);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Logout successful"
        )
    );
});

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      "User profile fetched successfully",
      req.user
    )
  );
});

export const updateMe = asyncHandler(async (req, res) => {
    const user = await updateProfile(req.user._id, req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Profile updated successfully",
            user
        )
    );
});