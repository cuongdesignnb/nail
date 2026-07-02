import { NextResponse } from "next/server";
import { fetchPackagesPageContent } from "@/services/packages-page.service";

export async function GET() {
  try {
    const data = await fetchPackagesPageContent();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET public packages page error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred",
      },
      { status: 500 }
    );
  }
}
