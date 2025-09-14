import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .toLocaleLowerCase()
        .replace(/\s+/g, "-") // Replace all spaces with hyphens
        .replace(/\./g, "-") // Replace all dots with hyphens
        .replace(/[^a-z0-9-]/g, "");  // Keep only letters, numbers, hyphens
        const extensionName = file.originalname.split(".").pop();
        const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "." + extensionName;
      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage });