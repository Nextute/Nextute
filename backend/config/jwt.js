import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function createSecretToken(userId, userType) {
  if (!process.env.TOKEN_KEY) {
    throw new Error("Missing TOKEN_KEY in environment variables.");
  }

  return jwt.sign(
    {
      id: userId,
      type: userType,
    },
    process.env.TOKEN_KEY,
    { expiresIn: "1d" }
  );
}
