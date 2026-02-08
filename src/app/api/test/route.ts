import { generateJwt, verifyJwt } from "@/lib/jwt";
import { login } from "@/services/authService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    data: await login("marko.petrovic@email.com", "test123"),
  });
}
