import { getAllCurrencies } from "@/services/currenciesService";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/currencies
 *
 * Fetch all currencies.
 *
 * Responses:
 * - 200 OK: Returns an array of currency objects.
 * - 500 INTERNAL_SERVER_ERROR: Any server side errors.
 */
export async function GET(req: NextRequest) {
  const currencies = await getAllCurrencies();
  if (currencies.length === 0) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
  return NextResponse.json({ success: true, currencies: currencies });
}
