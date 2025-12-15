import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";

dotenv.config();

const port = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: "https://chatapp-frontend-wn54.onrender.com",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// ✅ ✅ ✅ ADD THESE 2 ROUTES ✅ ✅ ✅
app.get("/", (req, res) => {
  res.json({ 
    message: "Chat App Backend API is Live! ✅", 
    timestamp: new Date(),
    endpoints: ["/api/auth", "/api/user", "/api/message", "/health"]
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    service: "chat-app-backend",
    timestamp: new Date() 
  });
});

// Connect DB & start server
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB Connection Failed:", error.message);
  });
