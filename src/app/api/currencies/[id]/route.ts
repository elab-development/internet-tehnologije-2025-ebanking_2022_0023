import { getCurrencyById } from "@/services/currenciesService";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/currencies/[id]
 *
 * Fetch a currency by ID.
 *
 * Path parameters:
 * - id (string): Currency ID
 *
 * Responses:
 * - 200 OK: Returns a currency object.
 * - 400 BAD_REQUEST: No currency with such ID.
 * - 500 INTERNAL_SERVER_ERROR: Any server side errors.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const currency = await getCurrencyById(params.id);
  if (!currency) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  return NextResponse.json({ success: true, currency: currency });
}
