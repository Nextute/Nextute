import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "nextute/images",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "nextute/videos",
    allowed_formats: ["mp4", "webm"],
    resource_type: "video",
  },
});

const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "nextute/documents",
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
    resource_type: "raw", // important for non-image files
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PNG, JPEG, JPG allowed."));
    }
  },
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const validTypes = ["video/mp4", "video/webm"];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only MP4, WebM allowed."));
    }
  },
});

const documentUpload = multer({
  storage: documentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",

      "image/png",
      "image/jpg",
      "image/jpeg",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only PDF, PNG, JPG, JPEG are allowed"),
        false
      );
    }
  },
}).array("documents", 5);

export { uploadImage, uploadVideo, documentUpload };
