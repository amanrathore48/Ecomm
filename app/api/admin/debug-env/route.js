import { NextResponse } from "next/server";

export async function GET() {
  // Check if key environment variables are set (without exposing their values)
  const envStatus = {
    AWS_REGION: !!process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: !!process.env.S3_BUCKET_NAME,
  };

  // Log environment variable status to server console
  console.log("Environment Variable Status:", envStatus);

  // Return status of environment variables (true if set, false if not)
  return NextResponse.json({ envStatus });
}
