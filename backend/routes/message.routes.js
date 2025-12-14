import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.js";
import  isAuth  from "../middlewares/isAuth.js";

const messageRouter = express.Router();

// Send message
messageRouter.post(
  "/send/:receiver",
  isAuth,
  upload.single("image"),
  sendMessage
);

// Get all messages between two users
messageRouter.get(
  "/messages/:receiver",
  isAuth,
  getMessages
);

export default messageRouter;
