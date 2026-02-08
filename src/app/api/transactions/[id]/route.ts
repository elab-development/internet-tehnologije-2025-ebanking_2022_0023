import { verifyJwt } from "@/lib/jwt";
import { getTransactionById } from "@/services/transactionsService";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/transactions/[id]
 *
 * Fetch a transaction by ID.
 *
 * Path parameters:
 * - id (number): Transaction ID.
 *
 * Responses:
 * - 200 OK: Returns a transaction object.
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

  const transaction = getTransactionById(params.id);
  if (!transaction) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  return NextResponse.json({ success: true, transaction: transaction });
}
