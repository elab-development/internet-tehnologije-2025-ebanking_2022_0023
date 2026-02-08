import { db } from "@/db";
import { Account, accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAccountById(id: string): Promise<Account | null> {
  const [search] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.clientID, id));

  if (!search) return null;
  return search;
}

export async function getAccountsByClientId(
  id: string,
): Promise<Array<Account>> {
  const search = await db
    .select()
    .from(accounts)
    .where(eq(accounts.clientID, id));
  return search;
}
