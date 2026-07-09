import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const registerUser = async ({ name, email, password, phone, role = "customer" }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "Email already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        phone,
    });

    return await User.findById(user._id).select("-password");
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = user.generateAccessToken();

    user.password = undefined;

    return {
        user,
        token,
    };
};