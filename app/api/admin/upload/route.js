import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import sharp from "sharp"; // Add sharp for image optimization

// Create a fresh S3 client for each request to ensure we have the latest config
const createS3Client = () => {
  const region = process.env.AWS_REGION || "us-east-1";

  // For Mumbai region (ap-south-1), we need to specify the exact endpoint
  return new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    // Force path style for compatibility with all regions
    forcePathStyle: true,
    // Use regional endpoint URL
    endpoint: `https://s3.${region}.amazonaws.com`,
  });
};

// For Next.js App Router, we need to use a different approach
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Allowed file types
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGE_DIMENSION = 2000; // Max width/height in pixels

export async function POST(request) {
  let filePath = null;
  try {
    // Debug the environment variables without exposing values
    console.log("S3 Upload Debug: Environment variables set:", {
      AWS_REGION: !!process.env.AWS_REGION,
      AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
      S3_BUCKET_NAME: !!process.env.S3_BUCKET_NAME,
    });

    console.log("Upload route accessed, processing request");

    // Get form data from the request
    const formData = await request.formData();

    // Extract the file and fields from formData
    const uploadedFile = formData.get("file");
    const productSlug = formData.get("slug");
    const isMainImage = formData.get("isMain") === "true";
    const imageIndex = formData.get("index") || "0";

    console.log("Form data received:", {
      productSlug,
      isMainImage,
      imageIndex,
      hasFile: !!uploadedFile,
      fileType: uploadedFile?.type,
      fileSize: uploadedFile?.size,
    });

    // Validate required fields
    if (!uploadedFile) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!productSlug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Create a temporary file path to store the uploaded file
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const fileBytes = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(fileBytes);

    // Validate file type
    const originalName = uploadedFile.name;
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Check file size
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
        },
        { status: 400 }
      );
    }

    const tempFilePath = path.join(
      tmpDir,
      `${crypto.randomBytes(8).toString("hex")}${ext}`
    );
    filePath = tempFilePath;

    // Write the file to disk
    fs.writeFileSync(tempFilePath, buffer);

    console.log(
      `Processing ${
        isMainImage ? "main" : `additional #${imageIndex}`
      } image for product: ${productSlug} (size: ${buffer.length} bytes)`
    );

    // Generate unique filename to avoid collisions
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const cleanSlug = productSlug.replace(/\s+/g, "-").toLowerCase();

    // Use a consistent naming convention for images
    const fileName = isMainImage
      ? `main_${uniqueId}${ext}`
      : `image_${imageIndex}_${uniqueId}${ext}`;

    // Store in a product-specific folder structure
    const Key = `products/${cleanSlug}/${fileName}`;

    console.log(`Preparing to upload to S3: ${Key}`);

    // Check if the image needs optimization
    let optimizedBuffer;
    try {
      // Only optimize images larger than 100KB to avoid unnecessary processing for small files
      if (buffer.length > 100 * 1024) {
        // Use sharp to resize and optimize the image
        const image = sharp(buffer);
        const metadata = await image.metadata();

        // Only resize if the image is larger than our max dimension
        const needsResize =
          metadata.width > MAX_IMAGE_DIMENSION ||
          metadata.height > MAX_IMAGE_DIMENSION;

        if (needsResize) {
          console.log(
            `Optimizing image: ${metadata.width}x${metadata.height} px`
          );
          optimizedBuffer = await image
            .resize({
              width: Math.min(metadata.width, MAX_IMAGE_DIMENSION),
              height: Math.min(metadata.height, MAX_IMAGE_DIMENSION),
              fit: "inside",
              withoutEnlargement: true,
            })
            .toBuffer();
        } else {
          // Just optimize without resizing
          optimizedBuffer = await image
            .jpeg({ quality: 85, progressive: true })
            .toBuffer();
        }

        console.log(
          `Image optimized: Original size: ${buffer.length} bytes, New size: ${optimizedBuffer.length} bytes`
        );
      } else {
        // For small images, skip optimization
        console.log(
          `Image is small (${buffer.length} bytes), skipping optimization`
        );
        optimizedBuffer = buffer;
      }
    } catch (error) {
      console.error(`Error optimizing image: ${error}`);
      // If optimization fails, use the original
      optimizedBuffer = buffer;
    }

    // Create a fresh S3 client for this request
    const s3Client = createS3Client();

    // Get bucket name directly from environment variables
    const bucketName = "amanprojectbuck"; // Hardcoded for now to debug

    // Upload to S3 with optimized content
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key,
      Body: optimizedBuffer,
      ContentType: uploadedFile.type || "application/octet-stream",
      CacheControl: "max-age=31536000", // Cache for 1 year
    });

    console.log(
      `Sending upload command to bucket: ${bucketName} with key: ${Key}`
    );
    await s3Client.send(uploadCommand);

    // Generate public URL - use the standard bucket URL format
    const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;

    console.log(`Upload successful, URL: ${url}`);

    // Clean up temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({
      success: true,
      url,
      key: Key,
    });
  } catch (error) {
    console.error("S3 upload error:", error);

    // Clean up temp file if it exists
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error("Error cleaning up temp file:", cleanupError);
      }
    }

    // Provide more specific error messages
    let errorMessage = "Failed to upload image";
    let statusCode = 500;

    if (error.name === "AbortError") {
      errorMessage = "Upload timed out";
    } else if (error.name === "AccessDenied") {
      errorMessage = "Access denied to S3 bucket";
      statusCode = 403;
    } else if (error.name === "NoSuchBucket") {
      errorMessage = "S3 bucket not found";
      statusCode = 404;
    } else if (error.code === "ENOTFOUND") {
      errorMessage = "Network error - Could not connect to S3";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
      },
      { status: statusCode }
    );
  }
}
