import { verifyJwt } from "@/lib/jwt";
import { getAccountById } from "@/services/accountsService";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/accounts/[id]
 *
 * Fetch an account by ID.
 *
 * Path parameters:
 * - id (string): Account ID
 *
 * Responses:
 * - 200 OK: Returns an account object.
 * - 400 BAD_REQUEST: No account with such ID.
 * - 401 UNAUTHORIZED: No JWT or invalid JWT.
 * - 500 INTERNAL_SERVER_ERROR: Any server side errors.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const jwt = authHeader.split(" ")[1];

  if (!verifyJwt(jwt)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const account = await getAccountById(params.id);
  if (!account) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  return NextResponse.json({ success: true, account: account });
}
