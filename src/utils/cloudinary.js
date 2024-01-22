import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { COLORS } from "../constant.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.COUDINARY_API_KEY,
  api_secret: process.env.COUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(COLORS.FgCyan, "\n\n");
    console.log("file uploaded on cloudinary link :\n", response.url);
    console.log(COLORS.Reset, "\n\n");
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // locally saved temp file as the upload process was failed
  }
};

cloudinary.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" },
  function (error, result) {
    console.log(result);
  }
);
