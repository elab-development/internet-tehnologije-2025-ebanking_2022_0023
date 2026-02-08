import { NextRequest } from "next/server";

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
 * -
 */
export async function GET(req: NextRequest) {}
