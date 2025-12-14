import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js"; 
import path from "path";
 
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `current user error ${error}` });
  }
};
export const editUserProfile = async (req, res) => {
  try {
    const { name } = req.body;
    let image;

    // 🖼 Agar nayi image aayi hai to Cloudinary pe upload karo
    if (req.file) {
      const filePath = path.resolve(req.file.path); // ✅ absolute path fix
      image = await uploadOnCloudinary(filePath);
    }

    // ✅ Update user document safely
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, ...(image && { image }) },
      { new: true } // ✅ return updated user
    ).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Edit profile error:", error);
    return res.status(500).json({
      message: `edit profile error ${error.message}`,
    });
  }
};


// get all users except current user
export const getOtherUsers= async (req, res) => {
  try {
    const users= await User.find({_id: {$ne: req.userId}}).select("-password")
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({message: `get other users error ${error}`})

  }
}