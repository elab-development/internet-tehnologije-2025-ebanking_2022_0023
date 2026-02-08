import { NextRequest } from "next/server";

/**
 * POST /api/auth/login
 *
 * Attempts to login a user.
 *
 * Responses:
 * - 200 OK: Successful login. Returns a user object.
 * - 400 BAD_REQUEST: No account with such ID.
 * - 500 INTERNAL_SERVER_ERROR: Any server side errors.
 */
export async function POST(req: NextRequest) {
  // Check if user exists
  // ...

  // If user doesn't exist, return error code
  // ...

  // Generate JWT, fetch user from DB and return
  // ...
}
