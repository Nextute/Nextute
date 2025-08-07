import express from "express";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotAndResetPasswordController.js";

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
