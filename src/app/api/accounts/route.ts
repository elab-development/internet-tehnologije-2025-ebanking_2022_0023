import { getUserId, verifyJwt } from "@/lib/jwt";
import { getAccountsByClientId } from "@/services/accountsService";
import { JsonWebTokenError } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/accounts
 *
 * Fetch accounts of a client.
 *
 * Responses:
 * - 200 OK: Returns an array of accounts.
 * - 401 UNAUTHORIZED: No JWT or invalid JWT.
 * - 500 INTERNAL_SERVER_ERROR: Any server side errors.
 */
export async function GET(req: NextRequest) {
  const body = await req.json();
  const jwt = body.jwt;

  if (!verifyJwt(jwt)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const userId = getUserId(jwt);
  const accounts = await getAccountsByClientId(userId);
  return NextResponse.json({ success: true, accounts: accounts });
}
