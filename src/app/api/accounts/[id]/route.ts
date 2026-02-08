import { NextRequest } from "next/server";

/**
 * GET /api/accounts/[id]
 *
 * Fetch an account by ID.
 *
 * Path parameters:
 * - id (number): Account ID
 *
 * Responses:
 * - 200 OK: Returns an account object.
 * - 400 BAD_REQUEST: No account with such ID.
 * - 401 UNAUTHORIZED: No JWT or invalid JWT.
 * - 500 INTERNAL_SERVER_ERROR: Any server side errors.
 */
export async function GET(req: NextRequest) {
  // Check for JWT presence and validity
  // ...
  // If it doesn't exist, return error code
  // ...
  // Fetch from DB and return
  // ...
}
