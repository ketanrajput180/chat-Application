import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  // ✅ Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    // 🧩 Debug check for env variables
    console.log("🔑 Cloudinary Config:", {
      CLOUD_NAME: process.env.CLOUD_NAME,
      API_KEY: process.env.API_KEY,
      API_SECRET: process.env.API_SECRET ? "✅ Loaded" : "❌ Missing",
    });

    console.log("📤 Uploading to Cloudinary from:", filePath);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "user_profiles", // optional
    });

    console.log("✅ Uploaded:", uploadResult.secure_url);

    // ✅ delete local file only if it exists
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return uploadResult.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);

    // ✅ safe delete
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return null;
  }
};

export default uploadOnCloudinary;
