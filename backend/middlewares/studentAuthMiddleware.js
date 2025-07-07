import jwt from "jsonwebtoken";
import prisma from "../db/index.js";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

const studentAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Student authentication required",
        error: "UNAUTHORIZED",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_KEY);

    if (decoded.type !== "student") {
      return res.status(403).json({
        status: false,
        message: "Invalid token type for student route",
        error: "FORBIDDEN",
      });
    }

    const student = await prisma.student.findUnique({
      where: { id: decoded.id },
    });

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found",
        error: "NOT_FOUND",
      });
    }

    req.student = student;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(401).json({
      status: false,
      message: "Authentication failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "UNAUTHORIZED",
    });
  }
};

export default studentAuth;
