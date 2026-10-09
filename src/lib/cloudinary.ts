import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadProductImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }
  if (file.size === 0 || file.size > 5 * 1024 * 1024) {
    throw new Error("Images must be smaller than 5 MB.");
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Product image uploads are not configured.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "simple-market/products", resource_type: "image" },
      (error, uploadResult) => {
        if (error) {
          reject(error);
        } else if (uploadResult) {
          resolve(uploadResult);
        } else {
          reject(new Error("Cloudinary returned no upload result."));
        }
      },
    );
    stream.end(bytes);
  });

  return result.secure_url;
}
