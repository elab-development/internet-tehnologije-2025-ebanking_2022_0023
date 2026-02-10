import { generateJwt } from "@/lib/jwt";
import { login } from "@/services/authService";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/login
 *
 * Attempts to login a user.
 *
 * Responses:
 * - 200 OK: Successful login. Returns a user object.
 * - 400 BAD_REQUEST: No account with such ID.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  const user = await login(email, password);
  if (!user) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const jwt = generateJwt({ userId: user.id, userRole: user.role });
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,      //dodao id
      role: user.role, //dodao uloge zbog razlicitih prikaza 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      nationalId: user.nationalId,
      dateOfBirth: user.dateOfBirth,
      sex: user.sex,
    },
    jwt: jwt,
  });
}
