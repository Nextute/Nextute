import nodemailer from "nodemailer";
import emailConfig from "../config/emailConfig.js";

const transporter = nodemailer.createTransport({
  service: emailConfig.service,
  auth: emailConfig.auth,
});

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: emailConfig.from,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="cid:logo@nextute" alt="Logo" width="100" />
          <h2 style="color: #333;">Email Verification</h2>
        </div>
        <p>Hi there,</p>
        <p>Thank you for signing up. To complete your registration, please use the verification code below:</p>
        <div style="background: #f3f3f3; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes. If you didn’t request this, please ignore this email.</p>
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

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
