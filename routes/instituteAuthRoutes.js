import express from "express";
const router = express.Router();

import instituteAuth from "../middlewares/instituteAuthMiddleware.js";
import {
  signup,
  verifyCode,
  login,
  updateProfileSection,
  getInstituteProfile,
} from "../controllers/instituteAuthController.js";

import upload from "../config/multer.js";
import { uploadLogo } from "../controllers/instituteMediaController.js";
import { validateEmailDomain } from "../middlewares/emailValidationMiddleware.js";

router.post("/signup", validateEmailDomain, signup);
router.post("/verify", verifyCode);
router.post("/auth/login", login);
router.patch("/me/:section", instituteAuth, updateProfileSection);
router.post("/me/logo", instituteAuth, upload.single("logo"), uploadLogo);

router.get("/profile", instituteAuth, getInstituteProfile);

export default router;
