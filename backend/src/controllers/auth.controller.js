import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import cookieOptions from "../utils/cookieOptions.js";

import {
    registerUser,
    loginUser,
} from "../services/auth.service.js";

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

    res.cookie("accessToken", token, cookieOptions);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            user
        )
    );
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", cookieOptions);

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