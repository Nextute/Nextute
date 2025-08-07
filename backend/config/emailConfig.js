import dotenv from "dotenv";

dotenv.config();

export default {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  from: `"Nextute EdTech Pvt. Ltd." <${process.env.EMAIL_USER}>`,
};
