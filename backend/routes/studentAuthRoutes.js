import express from "express";
const router = express.Router();

import studentAuth from "../middlewares/studentAuthMiddleware.js";
import {
  signup,
  verifyCode,
  login,
  getStudentProfile,
  logout,
} from "../controllers/studentAuthController.js";

import { validateEmailDomain } from "../middlewares/emailValidationMiddleware.js";

router.post("/signup", validateEmailDomain, signup);
router.post("/verify", verifyCode);
router.post("/auth/login", login);
router.post("/logout", logout);

router.get("/profile", studentAuth, getStudentProfile);

export default router;
