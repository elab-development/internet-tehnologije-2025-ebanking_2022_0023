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
 * - 400 BAD_REQUEST: No account with such number.
 * - 401 UNAUTHORIZED: No JWT or invalid JWT.
 * - 500 INTERNAL_SERVER_ERROR: Any server side errors.
 */
export async function GET(req: NextRequest) {
  // Check for JWT presence and validity
  // ...
  // If account doesn't exist, return error code
  // ...
  // Fetch from DB and return
  // ...
}
