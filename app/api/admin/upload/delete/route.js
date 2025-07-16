import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Create a fresh S3 client for each request
const createS3Client = () => {
  const region = process.env.AWS_REGION || "us-east-1";
  return new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: `https://s3.${region}.amazonaws.com`,
  });
};

// Configure API route
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Extract the key from the image URL
    // Example URL format: https://bucket-name.s3.region.amazonaws.com/products/product-slug/image.jpg
    let key;
    try {
      const url = new URL(imageUrl);
      // Extract the path without the leading slash
      key = url.pathname.slice(1);
    } catch (error) {
      console.error("Error parsing image URL:", error);
      return NextResponse.json(
        { error: "Invalid image URL format" },
        { status: 400 }
      );
    }

    // Create S3 client
    const s3Client = createS3Client();
    const bucketName = "amanprojectbuck"; // Hardcoded like in the upload route

    console.log(
      `Attempting to delete object: ${key} from bucket: ${bucketName}`
    );

    // Delete the object from S3
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);

    return NextResponse.json({
      success: true,
      message: "Image successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    return NextResponse.json(
      {
        error: "Failed to delete image",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
