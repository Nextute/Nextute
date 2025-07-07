import jwt from "jsonwebtoken";
import prisma from "../db/index.js";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

const instituteAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Institute authentication required",
        error: "UNAUTHORIZED",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_KEY);

    if (decoded.type !== "institute") {
      return res.status(403).json({
        status: false,
        message: "Invalid token type for institute route",
        error: "FORBIDDEN",
      });
    }

    const institute = await prisma.institute.findUnique({
      where: { id: decoded.id },
    });

    if (!institute) {
      return res.status(404).json({
        status: false,
        message: "Institute not found",
        error: "NOT_FOUND",
      });
    }

    req.institute = institute;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(401).json({
      status: false,
      message: "Institute authentication failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "UNAUTHORIZED",
    });
  }
};

export default instituteAuth;
