import express from "express";
import studentAuth from "../middlewares/studentAuthMiddleware.js";
import {
  signup,
  verifyCode,
  login,
  getStudentProfile,
  logout,
  resendStudentVerificationCode,
} from "../controllers/studentAuthController.js";
import { validateEmailDomain } from "../middlewares/emailValidationMiddleware.js";

const router = express.Router();

router.get("/profile", studentAuth, getStudentProfile);

router.post("/signup", validateEmailDomain, signup);
router.post("/verify", validateEmailDomain, verifyCode);
router.post(
  "/resend-verification",
  validateEmailDomain,
  resendStudentVerificationCode
);
router.post("/auth/login", login);
router.post("/logout", studentAuth, logout);

export default router;
