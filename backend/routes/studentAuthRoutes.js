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

router.get("/profile", studentAuth, getStudentProfile);

router.post("/signup", validateEmailDomain, signup);
router.post("/verify", verifyCode);
router.post("/auth/login", login);
router.post("/logout", logout);

export default router;
