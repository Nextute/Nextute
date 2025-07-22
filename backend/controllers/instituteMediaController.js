import { uploadImage, uploadVideo } from "../config/multer.js";
import { handleError } from "../utils/errorHandler.js";
import { validationResult } from "express-validator";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export const uploadImageHandler = uploadImage.single("image");

export const handleImageUpload = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Image upload validation error:", {
        errors: errors.array(),
        instituteId: req.institute?.id || "unknown",
      });
      return handleError(res, 400, errors.array()[0].msg, "VALIDATION_ERROR");
    }

    if (!req.file) {
      logger.warn("No image file provided", {
        instituteId: req.institute?.id || "unknown",
      });
      return handleError(res, 400, "No image file provided", "NO_IMAGE");
    }

    return res.status(200).json({
      status: true,
      url: req.file.path,
      resourceType: "image",
    });
  } catch (err) {
    logger.error("Image upload error:", {
      message: err.message,
      stack: err.stack,
      instituteId: req.institute?.id || "unknown",
    });
    if (err.name === "MulterError") {
      return handleError(res, 400, err.message, err.code);
    }
    return handleError(
      res,
      500,
      "Server error during image upload",
      "IMAGE_UPLOAD_ERROR"
    );
  }
};

export const uploadVideoHandler = uploadVideo.single("video");

export const handleVideoUpload = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Video upload validation error:", {
        errors: errors.array(),
        instituteId: req.institute?.id || "unknown",
      });
      return handleError(res, 400, errors.array()[0].msg, "VALIDATION_ERROR");
    }

    if (!req.file) {
      logger.warn("No video file provided", {
        instituteId: req.institute?.id || "unknown",
      });
      return handleError(res, 400, "No video file provided", "NO_VIDEO");
    }

    logger.info("Video uploaded successfully", {
      url: req.file.path,
      instituteId: req.institute?.id || "unknown",
    });

    return res.status(200).json({
      status: true,
      url: req.file.path,
      resourceType: "video",
    });
  } catch (err) {
    logger.error("Video upload error:", {
      message: err.message,
      stack: err.stack,
      instituteId: req.institute?.id || "unknown",
    });
    if (err.name === "MulterError") {
      return handleError(res, 400, err.message, err.code);
    }
    return handleError(
      res,
      500,
      "Server error during video upload",
      "VIDEO_UPLOAD_ERROR"
    );
  }
};


export const uploadDocumentsHandler = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No document files uploaded",
      });
    }

    const documentUrls = req.files.map((file) => file.path);

    return res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      urls: documentUrls,
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload documents",
      error: error.message,
    });
  }
};
