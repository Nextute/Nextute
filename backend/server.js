import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleError } from "./utils/errorHandler.js";

import studentAuthRoutes from "./routes/studentAuthRoutes.js";
import instituteAuthRoutes from "./routes/instituteAuthRoutes.js";

dotenv.config();

const app = express();

// Security middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// API routes
app.use("/api/students", studentAuthRoutes);
app.use("/api/institutes", instituteAuthRoutes);

// 404 handler
app.use((req, res) => {
  handleError(res, 404, "Endpoint not found", "NOT_FOUND");
});

// Error handler (must be last middleware)
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  handleError(res, 500, "Internal Server Error", "SERVER_ERROR");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
