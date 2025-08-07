import nodemailer from "nodemailer";
import emailConfig from "../config/emailConfig.js";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: emailConfig.service,
  auth: emailConfig.auth,
});

const sendUpdateEmail = async (email) => {
  const mailOptions = {
    from: emailConfig.from,
    to: email,
    subject: "New Institute Added to Our Platform",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="cid:logo@nextute" alt="Logo" width="100" />
          <h2 style="color: #333;">New Institute Available!</h2>
        </div>
        <p>Dear Subscriber,</p>
        <p>We’re excited to announce that few new institutes have been added to our platform!</p>
        <div style="background: #f3f3f3; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <a href="https://www.nextute.com/" style="color: #007bff; text-decoration: none; font-weight: bold;">Visit Nextute</a>
        </div>
        <p>Click the link above to explore these new institutes and discover exciting opportunities on our platform!</p>
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

export default sendUpdateEmail;
