import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js"; // ✅ FIX: import io also!

export const sendMessage = async (req, res) => {
    try {
        const sender = req.userId;
        const { receiver } = req.params;
        const { message } = req.body;

        let image = null;

        // --- Image Upload ---
        if (req.file) {
            const uploadedImageUrl = await uploadOnCloudinary(req.file.path);
            image = uploadedImageUrl;
        }

        // Find existing conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        });

        // Create new message
        const newMessage = await Message.create({
            sender,
            receiver,
            message: message || "",
            image
        });

        // Create new conversation if not exists
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, receiver],
                messages: [newMessage._id]
            });
        } else {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        // 🔥 FIX BUG: variable name was wrong
        const receiverSocketId = getReceiverSocketId(receiver);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json(newMessage);

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


export const getMessages = async (req, res) => {
    try {
        const sender = req.userId;
        const { receiver } = req.params;

        const conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        }).populate("messages");

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        return res.status(200).json(conversation.messages);

    } catch (error) {
        return res.status(500).json({
            message: "Get messages error",
            error: error.message
        });
    }
};
