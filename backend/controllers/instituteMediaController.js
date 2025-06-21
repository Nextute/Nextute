import { updateInstituteLogo } from "../controllers/instituteAuthController.js";
import { handleError } from "../utils/errorHandler.js";

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return handleError(res, 400, "No file uploaded", "NO_FILE_UPLOADED");
    }

    const secureUrl = req.file.path;
    const updatedInstitute = await updateInstituteLogo(
      req.institute.id,
      secureUrl
    );

    if (!updatedInstitute) {
      return handleError(
        res,
        404,
        "Institute not found",
        "INSTITUTE_NOT_FOUND"
      );
    }

    res.status(200).json({
      message: "Logo uploaded successfully",
      logoUrl: secureUrl,
      institute: updatedInstitute,
    });
  } catch (err) {
    handleError(res, 500, "Logo upload failed", "LOGO_UPLOAD_ERROR");
  }
};
