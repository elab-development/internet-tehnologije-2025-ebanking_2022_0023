import { db } from "@/db";
import { User, users } from "@/db/schema";
import { compare } from "bcrypt";
import { eq } from "drizzle-orm";

export async function login(
  email: string,
  password: string,
): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return null;

  const isValid = await compare(password, user.password);
  if (!isValid) return null;

  if (!user.active) return null;

  return user;
}
