import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import emailConfig from "../config/emailConfig.js";
import prisma from "../db/index.js";

dotenv.config();

export const sendResetPasswordEmail = async ({ email }) => {
  try {
    const institute = await prisma.institute.findUnique({ where: { email } });
    const student = await prisma.student.findUnique({ where: { email } });

    if (!institute && !student) {
      throw new Error("Email not found.");
    }

    const user = institute || student;
    const userType = institute ? "institute" : "student";

    // ✅ Generate raw token and hash it
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // ✅ Save hashed token + expiry in DB
    if (userType === "institute") {
      await prisma.institute.update({
        where: { id: user.id },
        data: {
          password_reset_token: hashedToken,
          password_reset_expires: expirationTime,
        },
      });
    } else {
      await prisma.student.update({
        where: { id: user.id },
        data: {
          password_reset_token: hashedToken,
          password_reset_expires: expirationTime,
        },
      });
    }

    // ✅ Prepare email with raw token in link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    const transport = nodemailer.createTransport({
      service: emailConfig.service,
      auth: emailConfig.auth,
    });

    const mailOptions = {
      from: emailConfig.from,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 10 minutes.</p>
        </div>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    throw new Error("Failed to send reset password email: " + error.message);
  }
};
