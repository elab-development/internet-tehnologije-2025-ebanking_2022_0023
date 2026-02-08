import { verifyJwt } from "@/lib/jwt";
import { getTransactionsByAccNo } from "@/services/transactionsService";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/transactions
 *
 * Fetch transactions tied to an account.
 *
 * Query parameters:
 * - accNo (string): Account number to filter transactions by.
 *
 * Responses:
 * - 200 OK: Returns an array of transactions.
 * - 400 BAD_REQUEST: No account with such number.
 * - 401 UNAUTHORIZED: No JWT or invalid JWT.
 * - 500 INTERNAL_SERVER_ERROR: Any server side errors.
 */
export async function GET(req: NextRequest) {
  const body = await req.json();
  const jwt = body.jwt;

  if (!verifyJwt(jwt)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const accNo = searchParams.get("accNo");

  const transactions = getTransactionsByAccNo(accNo);
  if (!transactions) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  return NextResponse.json({ success: true, transactions: transactions });
}
