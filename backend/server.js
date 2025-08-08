import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import winston from "winston";
import { handleError } from "./utils/errorHandler.js";

import studentAuthRoutes from "./routes/studentAuthRoutes.js";
import instituteAuthRoutes from "./routes/instituteAuthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import emailSubscriptionRoutes from "./routes/emailSubscriptionRoutes.js";

dotenv.config();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per window
//   message: "Too many requests from this IP, please try again later.",
// });
// app.use(limiter);

// Request logging
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
  next();
});

// Routes
app.get("/test", (req, res) => {
  res.status(200).json({ status: true, message: "Server is running!" });
});

app.use("/api/students", studentAuthRoutes);
app.use("/api/institutes", instituteAuthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subscribe", emailSubscriptionRoutes);

// 404 handler
app.use((req, res) => {
  return handleError(res, 404, "Endpoint not found", "NOT_FOUND");
});

// Error handler
app.use((err, req, res, next) => {
  logger.error("Server error:", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });
  return handleError(res, 500, "Internal Server Error", "SERVER_ERROR");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
