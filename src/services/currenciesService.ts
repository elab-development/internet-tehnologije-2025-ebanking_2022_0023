import { db } from "@/db";
import { currencies, Currency } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrencyById(id: string): Promise<Currency | null> {
  const [search] = await db
    .select()
    .from(currencies)
    .where(eq(currencies.id, id));

  if (!search) return null;
  return search;
}
