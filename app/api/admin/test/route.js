import { NextResponse } from "next/server";

// This is a simple test endpoint to verify that API routes are working
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "API route is working correctly",
    timestamp: new Date().toISOString(),
  });
}

// Test POST endpoint to verify form data handling
export async function POST(request) {
  try {
    const formData = await request.formData();
    const fields = {};

    // Extract all form fields
    for (const [key, value] of formData.entries()) {
      fields[key] = value;
    }

    return NextResponse.json({
      success: true,
      message: "Form data received successfully",
      fields,
    });
  } catch (error) {
    console.error("Error processing form data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process form data",
      },
      { status: 500 }
    );
  }
}
