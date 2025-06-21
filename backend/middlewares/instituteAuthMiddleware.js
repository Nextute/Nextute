import jwt from "jsonwebtoken";
import pool from "../db/index.js";
import { promisify } from "util";

const instituteAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Institute authentication required",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_KEY);

    if (decoded.type !== "institute") {
      return res.status(403).json({
        status: false,
        message: "Invalid token type for institute route",
      });
    }

    const { rows } = await pool.query(
      "SELECT * FROM institutes WHERE id = $1",
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        status: false,
        message: "Institute not found",
      });
    }

    req.institute = rows[0];
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Institute authentication failed",
      error: error.message,
    });
  }
};

export default instituteAuth;
