import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import emailConfig from "../config/emailConfig.js";
import prisma from "../db/index.js";

dotenv.config();

export const sendResetPasswordEmail = async ({ email }) => {
  try {
    // Check if the email exists in Institute
    const institute = await prisma.institute.findUnique({
      where: { email },
    });

    // Check if the email exists in Student
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!institute && !student) {
      throw new Error("Email not found.");
    }

    const user = institute || student;
    const userType = institute ? "institute" : "student";

    // Create hashed token
    const hashedToken = await bcrypt.hash(user.id, 10);

    // Set expiration to 10 minutes
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update the appropriate user table
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

    // Create email transporter
    const transport = nodemailer.createTransport({
      service: emailConfig.service,
      auth: emailConfig.auth,
    });

    // Email content
    const mailOptions = {
      from: emailConfig.from,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center;">
            <img src="cid:logo@nextute" alt="Logo" width="100" />
            <h2 style="color: #333;">Password Reset Request</h2>
          </div>
          <p>Hi there,</p>
          <p>You requested a password reset. Please click the link below to reset your password:</p>
          <div style="background: #f3f3f3; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <a href="${
              process.env.FRONTEND_URL
            }/reset-password?token=${hashedToken}" style="color: #007bff; text-decoration: none; font-weight: bold;">Reset Your Password</a>
          </div>
          <p>Or copy and paste this URL into your browser:<br />
          ${process.env.FRONTEND_URL}/reset-password?token=${hashedToken}</p>
          <p><strong>This link will expire in 10 minutes.</strong> If you didn’t request a password reset, please ignore this email.</p>
          <p>Best regards,<br><strong>Nextute Team</strong></p>
          <hr style="margin-top: 30px;" />
          <div style="font-size: 12px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} Nextute. All rights reserved.
          </div>
        </div>
      `,
      attachments: [
        {
          filename: "logo.png",
          path: "https://res.cloudinary.com/drhrgs6y5/image/upload/v1750255401/logo_pumpy6.png",
          cid: "logo@nextute",
        },
      ],
    };

    // Send the email
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    throw new Error("Failed to send reset password email: " + error.message);
  }
};
