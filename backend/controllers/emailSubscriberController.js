import { createEmailSubscriber } from "../models/emailSubscriberModel.js";
import prisma from "../db/index.js";
import { body, validationResult } from "express-validator";

export const subscribeEmail = [
  // Validation and sanitization rules
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail({ all_lowercase: true }),

  // Controller logic
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Check if the email is already subscribed
    const existingSubscriber = await prisma.Subscription.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return res.status(409).json({ error: "Email is already subscribed" });
    }

    try {
      const newSubscriber = await createEmailSubscriber(email);
      return res.status(201).json(newSubscriber);
    } catch (error) {
      console.error("Error subscribing email:", error);
      return res.status(500).json({ error: "Failed to subscribe email" });
    }
  },
];
