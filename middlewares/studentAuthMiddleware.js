import jwt from "jsonwebtoken";
import pool from "../db/index.js";
import { promisify } from "util";

const studentAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Student authentication required",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_KEY);

    const query = {
      text: "SELECT * FROM students WHERE id = $1::uuid",
      values: [decoded.id],
    };

    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Student not found" });
    }

    req.student = rows[0];
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", {
      message: error.message,
      stack: error.stack,
      token: req.headers.authorization?.split(" ")[1],
    });

    return res.status(500).json({
      status: false,
      message: "Authentication failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export default studentAuth;
