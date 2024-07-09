import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuring cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Uploading the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Fix: resource_type should be a string
        });

        console.log("File uploaded Successfully ->", response.url);

        // Removing the local file after upload
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error("Error while deleting the local file", err);
            }
        });

        return response;
    } catch (error) {
        // Removing the local file in case of an error
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error("Error while deleting the local file after failed upload", err);
            }
        });

        console.error("Error while uploading the image to Cloudinary", error);
        return null;
    }
};

export { uploadOnCloudinary };
