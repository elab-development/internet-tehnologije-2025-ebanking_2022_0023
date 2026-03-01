import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/exchange-rates
 *
 * Fetch the transaction rate from one currency to another.
 *
 * Query parameters:
 * - from (string): Currency code of the base currency.
 * - to (string):   Currency code of the other currency.
 *
 * Responses:
 * - 200 OK: Returns the exchange rate.
 * - 400 BAD_REQUEST: No query parameters specified.
 * - 500 INTERNAL_SERVER_ERROR: Any server side errors or external API error.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const currencyFrom = searchParams.get("from");
  const currencyTo = searchParams.get("to");

  if (!currencyFrom || !currencyTo) {
    return NextResponse.json(
      { success: false, error: "Missing query parameters." },
      { status: 400 },
    );
  }

  const res = await fetch(`https://open.er-api.com/v6/latest/${currencyFrom}`, {
    method: "GET",
  });
  const data = await res.json();
  if (data.result === "error") {
    return NextResponse.json(
      { success: false, error: "External API error." },
      { status: 500 },
    );
  }

  if (!data.rates[currencyTo]) {
    return NextResponse.json(
      { success: false, error: "External API error." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, rate: data.rates[currencyTo] });
}
