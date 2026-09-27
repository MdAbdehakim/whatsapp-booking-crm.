import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "NOT SET";
  // Mask the password for security
  const maskedUrl = dbUrl.replace(/:[^:@]+@/, ":****@");

  try {
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    return NextResponse.json({
      status: "connected",
      maskedUrl,
      result,
      directUrl: process.env.DIRECT_URL ? "SET" : "NOT SET",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      maskedUrl,
      directUrl: process.env.DIRECT_URL ? "SET" : "NOT SET",
      error: error.message,
      code: error.code,
    }, { status: 500 });
  }
}
