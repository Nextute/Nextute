import express from "express";
import {
  uploadImageHandler,
  uploadVideoHandler,
  handleImageUpload,
  handleVideoUpload,
} from "../controllers/instituteMediaController.js";
import {
  updateProfileSection,
  getInstituteProfile,
  signup,
  verifyCode,
  login,
  logout,
} from "../controllers/instituteAuthController.js";
import instituteAuth from "../middlewares/instituteAuthMiddleware.js";
import { validateEmailDomain } from "../middlewares/emailValidationMiddleware.js";

const router = express.Router();

router.get("/profile", instituteAuth, getInstituteProfile);

router.patch(
  "/upload/image",
  instituteAuth,
  uploadImageHandler,
  handleImageUpload
);
router.patch(
  "/upload/video",
  instituteAuth,
  uploadVideoHandler,
  handleVideoUpload
);
router.patch("/me/:section", instituteAuth, updateProfileSection);

router.post("/signup", validateEmailDomain, signup);
router.post("/verify", validateEmailDomain, verifyCode);
router.post("/auth/login", login);
router.post("/logout", instituteAuth, logout);

export default router;
