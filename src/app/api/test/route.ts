import { generateJwt, verifyJwt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  
  return NextResponse.json({ data: process.env.JWT_SECRET });
}
