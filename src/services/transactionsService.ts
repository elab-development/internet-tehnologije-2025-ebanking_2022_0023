import { db } from "@/db";
import { accounts, Transaction, transactions } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function getTransactionById(
  id: string,
): Promise<Transaction | null> {
  const [search] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id));

  if (!search) return null;
  return search;
}

export async function getTransactionsByAccNo(
  accNo: string | null,
): Promise<Array<Transaction> | null> {
  if (!accNo) return null;

  const [searchAcc] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.accountNo, accNo));
  if (!searchAcc) return null;

  const searchTr = await db
    .select()
    .from(transactions)
    .where(
      or(
        eq(transactions.accountSrcNo, accNo),
        eq(transactions.accountDestNo, accNo),
      ),
    );
  return searchTr;
}
