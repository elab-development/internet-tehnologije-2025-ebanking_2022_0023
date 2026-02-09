import { verifyJwt } from "@/lib/jwt";
import {
  createTransaction,
  getTransactionsByAccNo,
} from "@/services/transactionsService";
import { TransactionStatus } from "@/shared/types";
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
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const jwt = authHeader.split(" ")[1];

  if (!verifyJwt(jwt)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const accNo = searchParams.get("accNo");

  const transactions = await getTransactionsByAccNo(accNo);
  if (!transactions) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  return NextResponse.json({ success: true, transactions: transactions });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
  const jwt = authHeader.split(" ")[1];

  if (!verifyJwt(jwt)) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const {
      accountSrcNo,
      accountDestNo,
      amount,
      description,
      category,
      currencyID,
    } = body;

    if (!accountSrcNo || !accountDestNo || !amount || !currencyID) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const transaction = await createTransaction({
      accountSrcNo,
      accountDestNo,
      amount: -Math.abs(amount),
      description: description || null,
      category: category || null,
      currencyID,
      status: TransactionStatus.EXECUTED,
      timestamp: new Date(),
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Failed to create transaction" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, transaction }, { status: 201 });
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
