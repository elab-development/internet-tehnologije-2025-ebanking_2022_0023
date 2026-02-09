import { db } from "@/db";
import { accounts, Transaction, transactions } from "@/db/schema";
import { desc, eq, or, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { ExpenseCategory, TransactionStatus } from "@/shared/types";

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
    )
    .orderBy(desc(transactions.timestamp));
  return searchTr;
}

export async function createTransaction(data: {
  accountSrcNo: string;
  accountDestNo: string;
  amount: number;
  description: string | null;
  category: ExpenseCategory | null;
  currencyID: string;
  status: TransactionStatus;
  timestamp: Date;
}): Promise<Transaction | null> {
  try {
    // Create new transaction
    const [newTransaction] = await db
      .insert(transactions)
      .values({
        id: randomUUID(),
        ...data,
      })
      .returning();
    // Update account
    await db
      .update(accounts)
      .set({
        balance: sql`${accounts.balance} + ${data.amount}`,
      })
      .where(eq(accounts.accountNo, data.accountSrcNo));
    // to account?
    await db
      .update(accounts)
      .set({
        balance: sql`${accounts.balance} + ${Math.abs(data.amount)}`,
      })
      .where(eq(accounts.accountNo, data.accountDestNo));

    return newTransaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    return null;
  }
}
