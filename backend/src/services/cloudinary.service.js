import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = (file, folder = "car-rental") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) {
                    // console.error("Cloudinary Error:", error);
                    return reject(error);
                }

                resolve({
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                });
            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

export const uploadMultipleImages = async (
    files,
    folder = "car-rental"
) => {
    const uploadedImages = [];

    for (const file of files) {
        const image = await uploadImage(file, folder);

        uploadedImages.push(image);
    }

    return uploadedImages;
};

export const deleteImage = async (publicId) => {

    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);

};

export const deleteMultipleImages = async (publicIds = []) => {

    if (!publicIds.length) return;

    await Promise.all(
        publicIds.map(deleteImage)
    );

};