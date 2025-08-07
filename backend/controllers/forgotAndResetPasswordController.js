import prisma from "../db/index.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/sendResetPasswordEmail.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    // Step 1: Find user (institute or student)
    let user = await prisma.institute.findUnique({ where: { email } });
    let userType = "institute";

    if (!user) {
      user = await prisma.student.findUnique({ where: { email } });
      userType = "student";
    }

    if (!user) {
      return res.status(404).json({ error: "No user found with this email." });
    }

    // Step 2: Generate token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Step 3: Save token to DB
    if (userType === "institute") {
      await prisma.Institute.update({
        where: { email },
        data: {
          password_reset_token: token,
          password_reset_expires: expiry,
        },
      });
    } else {
      await prisma.Student.update({
        where: { email },
        data: {
          password_reset_token: token,
          password_reset_expires: expiry,
        },
      });
    }

    // Step 4: Send email with token
    await sendResetPasswordEmail({ email, token });

    return res.status(200).json({ message: "Reset password email sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


// RESET PASSWORD - Validates token and sets new password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: "Token and new password are required." });
  }

  try {
    const institute = await prisma.Institute.findFirst({
      where: {
        password_reset_token: token,
        password_reset_expires: { gt: new Date() },
      },
    });

    const student = await prisma.Student.findFirst({
      where: {
        password_reset_token: token,
        password_reset_expires: { gt: new Date() },
      },
    });

    const userType = institute ? "institute" : student ? "student" : null;
    const user = institute || student;

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (userType === "institute") {
      await prisma.institute.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          password_reset_token: null,
          password_reset_expires: null,
        },
      });
    } else {
      await prisma.student.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          password_reset_token: null,
          password_reset_expires: null,
        },
      });
    }

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


