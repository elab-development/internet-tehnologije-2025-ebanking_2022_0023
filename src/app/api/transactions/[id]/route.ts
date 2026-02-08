import { NextRequest } from "next/server";

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
export async function GET(req: NextRequest) {
  // Check for JWT presence and validity
  // ...
  // If transaction doesn't exist, return error code
  // ...
  // Fetch from DB and return
  // ...
}
