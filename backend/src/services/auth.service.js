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

export const updateProfile = async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (updateData.email && updateData.email !== user.email) {
        const emailExists = await User.findOne({ email: updateData.email });
        if (emailExists) {
            throw new ApiError(409, "Email already exists");
        }
    }

    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.phone) user.phone = updateData.phone;
    
    if (updateData.password) {
        if (!updateData.currentPassword) {
            throw new ApiError(400, "Current password is required to set a new password");
        }

        const userWithPassword = await User.findById(userId).select("+password");
        const isPasswordCorrect = await userWithPassword.comparePassword(updateData.currentPassword);
        if (!isPasswordCorrect) {
            throw new ApiError(400, "Current password is incorrect");
        }

        user.password = updateData.password;
    }

    await user.save();

    return await User.findById(userId).select("-password");
};